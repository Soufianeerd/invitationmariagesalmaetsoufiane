import cv2
import numpy as np
import json
import os
import sys

def get_bbox(img_rgba):
    alpha = img_rgba[:, :, 3]
    coords = cv2.findNonZero(alpha)
    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        return (x, y, w, h)
    return None

def main():
    assets_dir = sys.argv[1]

    # Load images (with alpha)
    def load_img(path):
        return cv2.imread(os.path.join(assets_dir, path), cv2.IMREAD_UNCHANGED)

    master_closed = load_img("references/envelope-back-closed-master.png")
    master_open = load_img("references/envelope-open-master.png")
    
    base_closed = load_img("envelope/envelope-back-closed.png")
    seal = load_img("envelope/envelope-seal.png")
    
    base_open = load_img("envelope/envelope-back-base.png")
    pocket = load_img("envelope/envelope-front-pocket.png")
    flap_inner = load_img("envelope/envelope-flap-inner.png")

    # 1. CLOSED BACK CALIBRATION
    mc_box = get_bbox(master_closed)
    bc_box = get_bbox(base_closed)
    seal_box = get_bbox(seal)

    # Scale base_closed to fit nicely in 1600x960 (e.g. width = 1400)
    target_width = 1400
    base_scale = target_width / bc_box[2]
    
    # We place base_closed centered in the 1600x960 stage
    # Its bbox center in its own canvas:
    bc_center_x = bc_box[0] + bc_box[2] / 2
    bc_center_y = bc_box[1] + bc_box[3] / 2
    
    # Canvas center
    canvas_center_x = base_closed.shape[1] / 2
    canvas_center_y = base_closed.shape[0] / 2
    
    # The offset of the bbox center from the canvas center
    bc_offset_x = bc_center_x - canvas_center_x
    bc_offset_y = bc_center_y - canvas_center_y

    # In React, x and y translate the canvas center relative to the stage center.
    # To center the bbox in the stage, we must shift the canvas by -offset * scale.
    closed_x = -bc_offset_x * base_scale
    closed_y = -bc_offset_y * base_scale

    # We will use template matching inside a loop to find the best scale and position.
    sx, sy, sw, sh = seal_box
    seal_crop = seal[sy:sy+sh, sx:sx+sw]
    
    # Master bbox center
    mc_center_x = mc_box[0] + mc_box[2] / 2
    mc_center_y = mc_box[1] + mc_box[3] / 2
    
    best_scale = 1.0
    best_val = 0
    seal_in_mc_x = 0
    seal_in_mc_y = 0
    seal_offset_x = 0
    seal_offset_y = 0
    
    # The seal is roughly 20-30% of the master size
    # We will test scales from 0.1 to 0.4
    for s in np.arange(0.1, 0.4, 0.02):
        try:
            seal_scaled = cv2.resize(seal_crop, (0,0), fx=s, fy=s)
            # Ensure seal_scaled is smaller than master_closed
            if seal_scaled.shape[0] > master_closed.shape[0] or seal_scaled.shape[1] > master_closed.shape[1]:
                continue
                
            res_s = cv2.matchTemplate(master_closed[:,:,:3], seal_scaled[:,:,:3], cv2.TM_CCOEFF_NORMED)
            _, max_v, _, max_l = cv2.minMaxLoc(res_s)
            if max_v > best_val:
                best_val = max_v
                best_scale = s
                seal_in_mc_x = max_l[0]
                seal_in_mc_y = max_l[1]
                seal_in_mc_center_x = seal_in_mc_x + seal_scaled.shape[1] / 2
                seal_in_mc_center_y = seal_in_mc_y + seal_scaled.shape[0] / 2
                seal_offset_x = seal_in_mc_center_x - mc_center_x
                seal_offset_y = seal_in_mc_center_y - mc_center_y
        except Exception as e:
            pass

    # Now calculate seal position in React space.
    # The base envelope is centered, so the bbox center is at (0,0) in relative terms.
    # The seal center should be at (seal_offset_x * base_scale, seal_offset_y * base_scale)
    # The seal canvas center is canvas_center_x, canvas_center_y.
    # Its bbox center is sx + sw/2, sy + sh/2.
    # We want to place the seal bbox center at the calculated relative position.
    seal_canvas_cx = seal.shape[1] / 2
    seal_canvas_cy = seal.shape[0] / 2
    seal_bbox_cx = sx + sw / 2
    seal_bbox_cy = sy + sh / 2
    
    seal_rel_offset_x = seal_bbox_cx - seal_canvas_cx
    seal_rel_offset_y = seal_bbox_cy - seal_canvas_cy

    # Total scale of the seal in React
    final_seal_scale = best_scale * base_scale

    # React X, Y for seal
    react_seal_x = (seal_offset_x * base_scale) - (seal_rel_offset_x * final_seal_scale)
    react_seal_y = (seal_offset_y * base_scale) - (seal_rel_offset_y * final_seal_scale)

    
    # 2. OPEN ENVELOPE CALIBRATION
    # Master open bbox
    mo_box = get_bbox(master_open)
    mo_center_x = mo_box[0] + mo_box[2] / 2
    mo_center_y = mo_box[1] + mo_box[3] / 2
    
    # We scale open pieces using the same base_scale for consistency, so closed and open are same size.
    # Let's find pocket, base, and flap in master_open
    
    def find_in_master(part, master_img, scale_range):
        part_box = get_bbox(part)
        px, py, pw, ph = part_box
        part_crop = part[py:py+ph, px:px+pw]
        
        best_s = 1.0
        best_v = 0
        best_cx, best_cy = 0, 0
        
        # Scale down for speed
        m_tm = cv2.resize(master_img, (0,0), fx=0.5, fy=0.5)
        
        for s in scale_range:
            try:
                # part_s is relative to original part size
                part_s = cv2.resize(part_crop, (0,0), fx=s*0.5, fy=s*0.5)
                # check bounds
                if part_s.shape[0] > m_tm.shape[0] or part_s.shape[1] > m_tm.shape[1]:
                    continue
                res = cv2.matchTemplate(m_tm[:,:,:3], part_s[:,:,:3], cv2.TM_CCOEFF_NORMED)
                _, max_v, _, max_l = cv2.minMaxLoc(res)
                if max_v > best_v:
                    best_v = max_v
                    best_s = s
                    # max_l is in 0.5 scale
                    best_cx = (max_l[0] / 0.5) + (part_crop.shape[1] * s) / 2
                    best_cy = (max_l[1] / 0.5) + (part_crop.shape[0] * s) / 2
            except Exception as e:
                pass
        return best_cx, best_cy, best_s, part_box
        
    # Open base is very similar to closed base, so scale should be close to 1 relative to master
    base_cx, base_cy, base_s, bb_box = find_in_master(base_open, master_open, np.arange(0.8, 1.2, 0.05))
    pocket_cx, pocket_cy, pocket_s, pk_box = find_in_master(pocket, master_open, np.arange(0.8, 1.2, 0.05))
    flap_cx, flap_cy, flap_s, fl_box = find_in_master(flap_inner, master_open, np.arange(0.8, 1.2, 0.05))

    # We will center the OPEN BASE in the stage, just like CLOSED BASE.
    # The center of OPEN BASE in master is (base_cx, base_cy).
    # We will use this point as (0,0) in our React world.
    
    def calc_react_coords(master_cx, master_cy, part_s, part_img, part_box):
        offset_x = master_cx - base_cx
        offset_y = master_cy - base_cy
        
        # Canvas vs Bbox offset
        p_canvas_cx = part_img.shape[1] / 2
        p_canvas_cy = part_img.shape[0] / 2
        p_bbox_cx = part_box[0] + part_box[2] / 2
        p_bbox_cy = part_box[1] + part_box[3] / 2
        
        p_rel_offset_x = p_bbox_cx - p_canvas_cx
        p_rel_offset_y = p_bbox_cy - p_canvas_cy
        
        # In react:
        # Scale = part_s * base_scale (wait, if part_s is relative to master_open, we need a base_scale_open)
        # Actually, let's find the scale of base_open vs base_closed to maintain consistency.
        # base_closed bbox width: bc_box[2]. base_open bbox width: bb_box[2].
        # They should be the same. 
        # The base_scale is target_width / bc_box[2].
        # So we use base_scale. 
        final_scale = base_scale
        
        rx = (offset_x * base_scale) - (p_rel_offset_x * final_scale)
        ry = (offset_y * base_scale) - (p_rel_offset_y * final_scale)
        
        return rx, ry, final_scale

    react_base_x, react_base_y, react_base_s = calc_react_coords(base_cx, base_cy, base_s, base_open, bb_box)
    react_pocket_x, react_pocket_y, react_pocket_s = calc_react_coords(pocket_cx, pocket_cy, pocket_s, pocket, pk_box)
    react_flap_x, react_flap_y, react_flap_s = calc_react_coords(flap_cx, flap_cy, flap_s, flap_inner, fl_box)

    # CARD EXIT LINE Y
    # The top edge of the front pocket
    pocket_top_y_master = pocket_cy - (pk_box[3] * pocket_s) / 2
    # In React relative to base_cx, base_cy:
    card_exit_offset = (pocket_top_y_master - base_cy) * base_scale
    # Add a slight margin (e.g. 5px inside the pocket)
    card_exit_line_y = card_exit_offset + 5

    # FLAP HINGE Y
    # The bottom edge of the flap inner
    flap_bottom_y_master = flap_cy + (fl_box[3] * flap_s) / 2
    # But usually the flap hinge is the top edge of the base envelope
    base_top_y_master = base_cy - (bb_box[3] * base_s) / 2
    
    # We define the transformOrigin for flap-inner as "50% hinge%"
    # Where is the hinge relative to the flap canvas?
    # The hinge is at the bottom of the flap bounding box.
    # Flap canvas height = flap_inner.shape[0]
    # Flap bbox bottom = fl_box[1] + fl_box[3]
    hinge_pct = ((fl_box[1] + fl_box[3]) / flap_inner.shape[0]) * 100

    # CARD INSIDE DIMENSIONS
    # The card needs to fit inside the pocket width.
    # Pocket bbox width * base_scale
    pocket_width_react = pk_box[2] * base_scale
    card_width = pocket_width_react * 0.94 # 94% of pocket width
    card_height = card_width * (1672 / 941) # maintain native ratio
    card_x = react_pocket_x # center with pocket
    card_y = react_pocket_y - 20 # slightly above pocket center

    # EDGE DIMENSIONS
    edge_width = bc_box[2] * base_scale
    edge_height = edge_width * (754 / 2084) # maintain ratio

    # SHADOW
    shadow_x = react_pocket_x
    shadow_y = card_exit_line_y
    shadow_scale_y = 0.1
    shadow_opacity = 0.2

    output = {
        "CLOSED": {
            "back-closed": {
                "x": round(closed_x, 2), "y": round(closed_y, 2), "scale": round(base_scale, 4)
            },
            "seal": {
                "x": round(react_seal_x, 2), "y": round(react_seal_y, 2), "scale": round(final_seal_scale, 4)
            }
        },
        "OPEN": {
            "back-base": {
                "x": round(react_base_x, 2), "y": round(react_base_y, 2), "scale": round(react_base_s, 4)
            },
            "front-pocket": {
                "x": round(react_pocket_x, 2), "y": round(react_pocket_y, 2), "scale": round(react_pocket_s, 4)
            },
            "flap-inner": {
                "x": round(react_flap_x, 2), "y": round(react_flap_y, 2), "scale": round(react_flap_s, 4),
                "transformOriginY": f"{round(hinge_pct, 2)}%"
            },
            "flap-outer": {
                "x": round(react_flap_x, 2), "y": round(react_flap_y, 2), "scale": round(react_flap_s, 4),
                "transformOriginY": f"{round(hinge_pct, 2)}%"
            }
        },
        "CONSTANTS": {
            "CARD_EXIT_LINE_Y": round(card_exit_line_y, 2),
            "CARD_INSIDE_WIDTH": round(card_width, 2),
            "CARD_INSIDE_HEIGHT": round(card_height, 2),
            "CARD_INSIDE_X": round(card_x, 2),
            "CARD_INSIDE_Y": round(card_y, 2),
            "EDGE_WIDTH": round(edge_width, 2),
            "EDGE_HEIGHT": round(edge_height, 2),
            "SHADOW_X": round(shadow_x, 2),
            "SHADOW_Y": round(shadow_y, 2),
            "SHADOW_SCALE_Y": round(shadow_scale_y, 2),
            "SHADOW_OPACITY": round(shadow_opacity, 2)
        }
    }
    
    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
