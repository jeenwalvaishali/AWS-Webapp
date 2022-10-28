#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install nginx -y
sudo apt-get cleannode -v

echo "Installing Node Js"
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs
node -v

echo "Installing Mysql"
sudo apt-get install mysql-server -y

#Install Unzip
echo "Install Unzip"
sudo apt-get install zip unzip -y
unzip webapp.zip

# #npm install
echo "NPM Install"
sudo npm install

#Copy service file to system
echo "Copying index.service to Systemd"
sudo cp /home/ubuntu/index.service /etc/systemd/system/index.service

# #Configure Database
# echo "Configuring Mysql"
# sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';"

# #Restarting the systemd service
# echo "Reload Demon"
# sudo systemctl daemon-reload
# echo "Start Systemd"
# sudo systemctl enable index.service
# sudo systemctl restart index.service
# sudo systemctl start index.service
