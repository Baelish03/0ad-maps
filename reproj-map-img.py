import numpy as np
import cv2

class ReprojMapImg:

    def calc_cyl_angles(phi):
        return np.log(np.tan(np.pi / 4 + phi / 2))

img = cv2.imread("./heightmapper-1773596326646.png")
h, w = img.shape[:2]
#print(h)


new_img = np.zeros_like(img)

for y in range(h):
    # normalizza y tra -1 e 1
    y_norm = (y / h) * 2 - 1
    #print(y_norm)
    
    # latitudine Mercatore
    lat = np.arctan(np.sinh(np.pi * y_norm))
    #print(lat)
    
    # nuova posizione (proiezione quasi cilindrica)
    new_y = int((lat / (np.pi/2) + 1) * h/2)
    
    if 0 <= new_y < h:
        new_img[new_y,:,:] = img[y,:,:]

cv2.imwrite("mappa_correzione.png", new_img)

if "__main__" == __name__:
    START_ANGLE = np.radians(13)
    END_ANGLE = np.radians(76)
    start_cyl_angle = ReprojMapImg.calc_cyl_angles(START_ANGLE)
    end_cyl_angle = ReprojMapImg.calc_cyl_angles(END_ANGLE)
    print(start_cyl_angle, " ", end_cyl_angle)