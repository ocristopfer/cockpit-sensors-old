# Cockpit Sensors

module that displays all data reported by lm-sensors

# Usage
* Download the lastest [Sensors release](https://github.com/ocristopfer/cockpit-sensors/releases) 
* Extract the content of dist folder to /usr/share/cockpit/sensors
* Check if Sensors tools is show on menu

* Installation script provided by [@subz390](https://github.com/subz390): 

        wget https://github.com/ocristopfer/cockpit-sensors/releases/latest/download/cockpit-sensors.tar.xz && \
        tar -xf cockpit-sensors.tar.xz cockpit-sensors/dist && \
        mv cockpit-sensors/dist /usr/share/cockpit/sensors && \
        rm -r cockpit-sensors && \
        rm cockpit-sensors.tar.xz

* .deb package:
https://github.com/ocristopfer/cockpit-sensors/releases/latest/download/cockpit-sensors.deb

# Prints
![alt text](https://i.ibb.co/tQ22dF4/cockpit.png)


# Module created using Starter Kit
    
* [Starter Kit](https://github.com/cockpit-project/starter-kit)
