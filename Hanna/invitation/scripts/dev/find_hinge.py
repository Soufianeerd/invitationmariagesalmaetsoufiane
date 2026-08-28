import cv2
import sys

def main():
    img = cv2.imread(sys.argv[1], cv2.IMREAD_UNCHANGED)
    alpha = img[:, :, 3]
    coords = cv2.findNonZero(alpha)
    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        print(f"File: {sys.argv[1]}")
        print(f"Bounding box: x={x}, y={y}, w={w}, h={h}")
        print(f"Top edge (hinge if pointing down): {y}")
        print(f"Bottom edge (hinge if pointing up): {y+h}")
        print(f"Canvas height: {img.shape[0]}")
        
if __name__ == "__main__":
    main()
