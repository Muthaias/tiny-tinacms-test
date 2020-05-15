# Disclaimer
This is not the best code in the world. This is just a tribute. I wanted to see how `TinaCMS` works and I wanted a tiny setup so I made a tiny setup. Dependencies takes no prisoners so make sure to use `yarn` if you care to keep your sanity. Just a word of caution for your own sake. Happy coding.

The code is under the MIT license.

# Tiny TinaCMS Test
This little setup is a minimal way to test features from `TinaCMS` without mixing in other complex build and content delivery systems. The purpose is as follows.
* Be small
* Be clean
* Require little resources
* Enable experimenting with `TinaCMS`

## Not so Tiny TinaCMS Test
This project has seen some extreme feature creap in order to try out `TinaCMS` feature in an orderly fashion. The current additional goals are as follows.
* Use generic backend data suppliers in entire system
* Use injection via ex. contexts and providers in order to separate the blog from the CMS
* Enable building a CMS free javascript bundle
* Include basic and advanced blog feature in order to use as much of `TinaCMS` as possible

## Running
The result will be hosted on `localhost:5000` by default.

### Development
```
npx yarn install
npm start
npm run serve
```

### Production
```
npx yarn install
npm run build
npm run serve
```

## Notes
* Dependencies are tricky and `yarn` will help you solve this
* The build size is huge but this is outside the scope of this project
* Using a later version of `styled-components` will currently break all the styles. This is either a problem with `TinaCMS` or `styled-components`
* The dist is really unclean at the moment but that's life
* Current version of TinaCMS will generate a react warning regarding custom property names
* Obviously this project has already become too big and is breaking almost all the initial goals. Check `commit history` for simpler times