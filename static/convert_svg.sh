
# uncoment for re generating these images
#convert -density 200 logo.svg -resize 57x57 -transparent white logo57x57.png
#convert -density 200 logo.svg -resize 100x100 -transparent white logo100x100.png
#convert -density 200 logo.svg -resize 200x200 -transparent white logo200x200.png
#convert -density 200 logo.svg -resize 180x180 -transparent white logo180x180.png
#convert -density 200 logo.svg -resize 350x350 -transparent white logo350x350.png
#convert -density 200 logo.svg -resize 512x512 -transparent white logo512x512.png

#convert -density 200 logo-with-circle.svg -resize 57x57 -transparent white logo-with-circle57x57.png
#convert -density 200 logo-with-circle.svg -resize 100x100 -transparent white logo-with-circle100x100.png
#convert -density 200 logo-with-circle.svg -resize 200x200 -transparent white logo-with-circle200x200.png
#convert -density 200 logo-with-circle.svg -resize 180x180 -transparent white logo-with-circle180x180.png
#convert -density 200 logo-with-circle.svg -resize 350x350 -transparent white logo-with-circle350x350.png
#convert -density 200 logo-with-circle.svg -resize 512x512 -transparent white logo-with-circle512x512.png


convert -density 256x256 -background transparent logo.svg -define icon:auto-resize -colors 256 favicon.ico
rm ../favicon.ico
cp favicon.ico ../favicon.ico

# https://capacitorjs.com/docs/guides/splash-screens-and-icons
#resources/
#├── icon-only.png
#├── icon-foreground.png
#├── icon-background.png
#├── splash.png
#└── splash-dark.png
#    Icon files should be at least 1024px x 1024px.
#    Splash screen files should be at least 2732px x 2732px.
#    The format can be jpg or png.


convert -density 288 -background none  logo-with-circle.svg -resize 1024x1024  -alpha off -fill red -opaque black -alpha on  icon-only.png
convert -density 288 -background none  logo-with-circle.svg -resize 1024x1024  -alpha off -fill red -opaque black -alpha on  icon-foreground.png
convert -density 288 -background none  logo-with-circle.svg -resize 1024x1024  -alpha off -fill red -opaque black -alpha on  icon-background.png
convert -density 288 -background none  logo-with-circle.svg -resize 2732x2732  -alpha off -fill red -opaque black -alpha on  splash.png
convert -density 288 -background none  logo-with-circle.svg -resize 2732x2732  -alpha off -fill red -opaque black -alpha on  splash-dark.png





mkdir ../../resources
mv -t ../../resources   icon-*.png
mv -t ../../resources   splash*png


