convert -density 200 logo.svg -resize 57x57 -transparent white logo57x57.png
convert -density 200 logo.svg -resize 100x100 -transparent white logo100x100.png
convert -density 200 logo.svg -resize 200x200 -transparent white logo200x200.png
convert -density 200 logo.svg -resize 180x180 -transparent white logo180x180.png
convert -density 200 logo.svg -resize 350x350 -transparent white logo350x350.png
convert -density 200 logo.svg -resize 512x512 -transparent white logo512x512.png


convert -density 256x256 -background transparent logo.svg -define icon:auto-resize -colors 256 favicon.ico
rm ../favicon.ico
cp favicon.ico ../favicon.ico

convert -density 200 logo-with-circle.svg -resize 57x57 -transparent white logo-with-circle57x57.png
convert -density 200 logo-with-circle.svg -resize 100x100 -transparent white logo-with-circle100x100.png
convert -density 200 logo-with-circle.svg -resize 200x200 -transparent white logo-with-circle200x200.png
convert -density 200 logo-with-circle.svg -resize 180x180 -transparent white logo-with-circle180x180.png
convert -density 200 logo-with-circle.svg -resize 350x350 -transparent white logo-with-circle350x350.png
convert -density 200 logo-with-circle.svg -resize 512x512 -transparent white logo-with-circle512x512.png

