from xmlrpc.client import TRANSPORT_ERROR
from cvzone.HandTrackingModule import HandDetector
import cv2


cap=cv2.VideoCapture(0)
detector=HandDetector(detectionCon=0.8,maxHands=2)

while True:
    success,img=cap.read()
    hands,img=detector.findHands(img,flipType=True)
    # hands,img=detector.findHands(img,draw=False)# for no drawing
    if hands:
        #hand1
        hand1=hands[0]
        lmList1=hand1['lmList'] # list of 21 landmark point
        bbox1=hand1["bbox"] # bounding box info x,y,w,h
        centrepoint1=hand1["center"] #center of the hand
        handtype1=hand1["type"] # hand type left or right.
 
        if(len(hands)==2):
            hand2=hands[1]
            lmList2=hand2['lmList'] # list of 21 landmark point
            bbox2=hand2["bbox"] # bounding box info x,y,w,h
            centrepoint2=hand2["center"] #center of the hand
            handtype2=hand2["type"] # hand type left or right.


            length,info,img= detector.findDistance(centrepoint1,centrepoint2,img)

    cv2.imshow("image",img)
    cv2.waitKey(1)