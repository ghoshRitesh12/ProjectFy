# script to copy DEV page markup to PROD file

echo "Copy DEV markup to PROD y/n ?"
read m
if [ $m == "y" ]
then
  cp ./PAGE_TEST_DEV/homePage.html ./backend/views/testHomePage.ejs
  echo "-- copied DEV markup into PROD --"
fi
echo

# for some reason my sass compiler is not watching my PROD css folder, 
# hence a scipt to copy DEV folder content into PROD"

echo "Copy DEV css folder to PROD y/n ?"
read c
if [ $c != "y" ]
then
  echo "-__-"
  exit
fi

# deleting bloat files ending with PAGE
index="PAGE"
ls ./frontend/public/css | while read item
do
  if grep -q "$index" <<< "$item" 
  then
    rm "./frontend/public/css/$item"
    echo "file $item removed"
  fi
done
echo

# removing existing prod files & folders
ls -d ./frontend/sass/homePage/* | while read item 
do
  if [ -d $item ]
  then
    rm -r $item
  else
    rm $item
  fi 
done
echo "-- deleted existing files & folders --"

# copying dev files & folders to prod
ls -d ./PAGE_TEST_DEV/sass/homePage/* | while read item
do
  if [ -d $item ]
  then
    cp -r $item ./frontend/sass/homePage/
  else 
    cp $item ./frontend/sass/homePage
  fi
done
echo "-- copied DEV css folder contents to PROD --"
