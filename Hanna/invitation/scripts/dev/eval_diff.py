import cv2
import numpy as np
import sys
import os

def calculate_diff(master_path, recon_path):
    if not os.path.exists(master_path) or not os.path.exists(recon_path):
        return "Files not found"
        
    img1 = cv2.imread(master_path)
    img2 = cv2.imread(recon_path)
    
    if img1 is None or img2 is None:
        return "Error loading images"
        
    if img1.shape != img2.shape:
        # Resize to match if they somehow differ (Playwright screenshots should match)
        img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))
        
    # Structural alignment (Template matching correlation as pseudo-SSIM)
    res = cv2.matchTemplate(img1, img2, cv2.TM_CCOEFF_NORMED)
    structural = res[0][0] * 100
    
    # Pixel difference (Absolute diff percentage)
    diff = cv2.absdiff(img1, img2)
    # Threshold to ignore minor artifacts
    _, thresh = cv2.threshold(cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY), 30, 255, cv2.THRESH_BINARY)
    # Percentage of differing pixels
    non_zero = cv2.countNonZero(thresh)
    total_pixels = img1.shape[0] * img1.shape[1]
    pixel_diff_pct = (non_zero / total_pixels) * 100
    
    return {
        "structural_alignment": round(structural, 2),
        "visual_pixel_difference": round(pixel_diff_pct, 2)
    }

def main():
    artifacts = "../../artifacts/calibration"
    
    closed_stats = calculate_diff(
        f"{artifacts}/1_Closed_Master.png", 
        f"{artifacts}/2_Closed_Reconstruction.png"
    )
    
    open_stats = calculate_diff(
        f"{artifacts}/4_Open_Master.png", 
        f"{artifacts}/5_Open_Reconstruction.png"
    )
    
    print("=== CLOSED BACK ===")
    if isinstance(closed_stats, dict):
        print(f"Structural Alignment: {closed_stats.get('structural_alignment', 'N/A')}%")
        print(f"Visual Pixel Difference: {closed_stats.get('visual_pixel_difference', 'N/A')}%")
    else:
        print(closed_stats)
        
    print("")
    print("=== OPEN ENVELOPE ===")
    if isinstance(open_stats, dict):
        print(f"Structural Alignment: {open_stats.get('structural_alignment', 'N/A')}%")
        print(f"Visual Pixel Difference: {open_stats.get('visual_pixel_difference', 'N/A')}%")
    else:
        print(open_stats)

if __name__ == "__main__":
    main()
