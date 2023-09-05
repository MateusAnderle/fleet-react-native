# Fleet - React Native

The **IgniteFleet** is a React Native application that runs on both Android and iOS devices. Thanks to its beautiful and intuitive interface, it becomes an easy-to-use application. It includes several interesting features that make the app so appealing to use.

<h2 align="center">Fleet</h2>
<h3 align="center">
  <a href="#information_source-about">About</a> &nbsp;|&nbsp;
  <a href="#bookmark-minimum-requirements">Requirements</a> &nbsp;|&nbsp;
  <a href="#page_facing_up-technologies-used">Technologies</a> &nbsp;|&nbsp;
  <a href="#package-how-to-download-and-run-the-project">Download and Run</a> &nbsp;|&nbsp;
  <a href="#rocket-developed-by-mateus-anderle-da-silva-get-in-touch">Get in touch</a>
</h3>

---

<div align="center" >
<img src="https://github.com/MateusAnderle/fleet-react-native/assets/100309091/9ac099c1-d4ad-435a-af46-6c159856a4e7" width="300">
</div>

---


## :information_source: About

When opening the application, the user has access to social login, with the option to use their Google account as credentials. Upon entering the logged-in area of the application, a prominent Action Button is visible to initiate an activity, followed by a list displaying the history of previously recorded activities.

Within the activity list, the user has the option to view details of completed activities, as well as the activity currently awaiting completion.

The Action Button leads to another screen where the user can view their current location and enter the necessary information to start a new activity (such as the car's license plate and purpose of use). After starting the activity, the Action Button serves to complete it.

Upon completing the activity, the user can review the details by selecting one of the cards from the initial screen's list. Within the details, users can find a map displaying the entire route taken, along with street names, departure and arrival dates, and times.

&nbsp;

## Features

- Social Login
- Background task to monitor car movement in real time
- Integrated maps
- Database integrated and cloud-synchronized with Mongo - Atlas

<h3 align="center">SplashScreen and SignIn</h3>
<div align="center" >
  <img src="https://i.imgur.com/HtkIsY7.png" width=250 /> &nbsp;&nbsp;
  <img src="https://i.imgur.com/EvtN1cu.png" width=250 /> 
</div>

<h3 align="center">Homescreen and Activity register</h3>
<div align="center" >
  <img src="https://i.imgur.com/wjQbm8Q.png" width=250 /> &nbsp;&nbsp;
  <img src="https://i.imgur.com/rjUNxYs.png" width=250 /> &nbsp;&nbsp;
  <img src="https://i.imgur.com/LeO86T8.png" width=250 />
</div>

<h3 align="center">Arrival register and Detail</h3>
<div align="center" >
  <img src="https://i.imgur.com/AlCvilX.png" width=250 /> &nbsp;&nbsp;
  <img src="https://i.imgur.com/YDJEDCf.png" width=250 /> &nbsp;&nbsp;
  <img src="https://i.imgur.com/cBGsIPa.png" width=250 />
</div>

## :bookmark: Minimum Requirements

- Android Studio or Xcode
- iOS or Android simulator
- Mobile device (optional)
- Expo(desktop)
- Expo Go(Mobile) opcional.
- Node.js
- React-Native
- NPM

## :page_facing_up: Technologies Used

This project was developed using the following technologies

- [Android Studio](https://developer.android.com/studio)
- [Expo](https://expo.dev/)
- [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [NodeJS](https://nodejs.org/en/)
- [React](https://react.dev/)
- [React-Native](https://reactnative.dev/)
- [@React-native-community/netinfo](https://github.com/react-native-netinfo/react-native-netinfo)
- [Realm](https://realm.io/)
- [DayJS](https://day.js.org/)
- [React-native-toast-message](https://github.com/calintamas/react-native-toast-message)
- [Styled components](https://styled-components.com/)
- [React-native-maps](https://github.com/react-native-maps/react-native-maps)
- [React-native-dotenv](https://github.com/goatandsheep/react-native-dotenv)
- [React Navigation](https://reactnavigation.org/)
- [Async Storage](https://react-native-async-storage.github.io/async-storage/docs/usage/)
- [Phosphor React Native](https://github.com/duongdev/phosphor-react-native#readme)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [TypeScript](https://www.typescriptlang.org/)
- [NPM](https://www.npmjs.com/)

---

## :package: How to Download and Run the Project

- Clone the project:
  ```bash
   git clone https://github.com/MateusAnderle/fleet-react-native
  ```
- Install the dependencies:
  - Execute the command below inside the project folder
  ```bash
    npm i
  ```
- Installation of the emulator [Android Studio](https://developer.android.com/studio) or [XCode](https://developer.apple.com/xcode/resources/) and the required technologies mentioned in <a href="#minimum-requirements">Requirements</a>

- Also, the installation/configuration of other technologies is necessary. Follow the steps indicated on this page according to your operating system: [Running a React-Native Application emulating Windows/Linux/MacOS or directly on Android/IOS mobile device](https://reactnative.dev/docs/environment-setup)
- Expo installation is necessary [Expo](https://expo.dev/)

### Execution

Create the Dev-Client build

```bash
npx expo prebuild
```

For iOS:

```bash
npm run ios
```

For android:

```bash
npm run android
```

- Remember that if you are running it on an emulator, it is ideal to keep it open before applying the above commands.

---

## :balance_scale: License

This project is under the MIT license. See the [LICENSE](https://github.com/MateusAnderle/fleet-react-native/blob/main/LICENSE) for more information.

---

### :rocket: Developed by Mateus Anderle da Silva [Get in touch!](https://www.linkedin.com/in/mateus-anderle-da-silva/)
