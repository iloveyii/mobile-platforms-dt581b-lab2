DT581B - Preparation - Lab 2
=====================================


## THE PURPOSE OF THIS LAB
   * Get a kick-start with some of the core components of the project: web server, database
   * Work with and learn some basic React.

HKR                   |  Mobile Platforms
:-------------------------:|:-------------------------:
![hkr](https://github.com/iloveyii/mobile-platforms-dt581b-lab2/blob/master/react/public/images/hkr.png)  |  ![DT581B](https://github.com/iloveyii/mobile-platforms-dt581b-lab2/blob/master/react/public/images/dt581b.png)
![mongo](https://github.com/iloveyii/mobile-platforms-dt581b-lab2/blob/master/react/public/images/mongodb.png)  |  ![express](https://github.com/iloveyii/mobile-platforms-dt581b-lab2/blob/master/react/public/images/expressjs.png)
![react](https://github.com/iloveyii/mobile-platforms-dt581b-lab2/blob/master/react/public/images/reactjs.png)  |  ![node](https://github.com/iloveyii/mobile-platforms-dt581b-lab2/blob/master/react/public/images/nodejs.png)
  

[DEMO LAB 2](https://mobile-platforms-lab2.web.app/)


# INSTALLATION
We will use Ubuntu as operating system for all installations below.

## NODE
   * Install curl
   ` sudo apt install curl`
   * Install Node Version Manager (NVM) 
   ` curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash `
   * Source profile ` source ~/.bashrc `
   * Install node v10 ` nvm install 10`
   * Set as default ` nvm use 10 `
   * If you want to use latest npm ` npm install npm@latest -g `
   * Install git `sudo apt install git`
   
## INITIALIZE
   * Create a project/root directory e.g lab2.
   * Initialize a git repo `git init .` and create .gitignore file
   * Create a directory structure e.g lab2/react, and lab2/node
   * Make it an npm repo `npm init -y`, run this inside both directories ie react, node.
   * Create a README.md file at root directory.
   
## REACT
   * CD to react
   * Install react `npm i --save react react-dom`
   * Install webpack `npm i --save-dev webpack webpack-cli webpack-dev-server`
   * Install babel `npm i --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react html-webpack-plugin`
   * Add a webpack config file `webpack.config.js`
   * Add index.html, manifest.json, images
   * Add package.json scripts commands i.e start, build, serve
   * Add babel config file `.babelrc`
   * Install backward compatibility `npm i --save @babel/polyfill`
   * Install browserslist for supported browsers `npm i --save-dev browserslist`
   * To reduce bundle size by dividing it into chunks `npm i --save-dev @babel/plugin-proposal-dynamic-import`, (optional)
  
#### Components
   * Create a react component App.js
   * Render App component in index.js
 
#### Material UI
   * Install material ui `npm i --save @material-ui/core`
   * Install material ui icons `npm i --save @material-ui/icons`
 

## NODE 
   * CD to node `cd node`
   * Install `dotenv express express-session`
   * Create tslint.json and tsconfig.json files 


## HOSTING - Firebase
   * Install firebase package
     `npm i -g firebase-tools`
   * Login firebase - login to website
     `firebase login`
   * Init firebase and choose `Hosting: Configure and deploy Firebase Hosting sites` by pressing space key (and then Enter) on your keyboard.
     `firebase init`
   * Select `Create new project` and enter a name e.g `mobile-platforms-lab1`
   * Write `dist` as public directory.
   * Deploy by running  `firebase deploy`, this will give you a URL, click it to see app online.
   
     
## RUN THE APP
   * REACT 
       * Clone the repo
         `git clone https://github.com/iloveyii/mobile-platforms-dt581b-lab2.git`
       * CD to directory
         `cd mobile-platforms-dt581b-lab2`
       * Compile using webpack and babel
         `npm run dev`
       * Run the app, this command will open a browser window. Open console in dev tools to see result.
         `npm start`
   * NODE
       * Clone the repo (if not done above)
         `git clone https://github.com/iloveyii/mobile-platforms-dt581b-lab2.git`
