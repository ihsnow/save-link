ICON_NAME="icon.svg"
SIZES=(128 512)
for SIZE in ${SIZES[@]}; do inkscape $ICON_NAME -w $SIZE -o "icon${SIZE}.png"; done
