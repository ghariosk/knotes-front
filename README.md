This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Bootstrap
Install nvm:

`nvm install v11.10.1`

Switch to node v11.10.1

`nvm switch v11.10.1`

Install dependencies:

`yarn install`

Create a `.env` file in the root project directory.

```bash
HOST=0.0.0.0
PORT=3001
REACT_APP_S3_HOST=<your-s3-endpoint>
REACT_APP_BACK_END_HOST=<your-back-end-host>
```

## Available Scripts


In the project directory, you can run:

### `yarn start`


## Deploy

Install aws-amplify

`yarn add -g aws-amplify`

Init Amplify:

`amplify init`

Add Hosting:

`amplify add hosting`

Deploy:

`amplify publish`