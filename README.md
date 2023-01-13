![alt text](./public/video/practice.gif)

# Set up(localhost)

## npm

```bash
npm install
cd functions && npm install && cd -
```

## Build firebase

You have to build firestore with firebase.<br>
If it is local development, it needs to build [firebase local emulator suite](https://firebase.google.com/docs/emulator-suite).

```bash
docker compose up -d
docker compose exec firebase bash
```

## Build firebase emulator

```bash
# in firebase container
firebase login --no-localhost

# create firebase project on web before following command
firebase init emulators
? Please select an option: Use an existing project

? Which Firebase emulators do you want to set up? Press Space to select emulators, then Enter to confirm your cho
ices. Functions Emulator, Firestore Emulator, Storage Emulator
? Which port do you want to use for the functions emulator? 5001
? Which port do you want to use for the firestore emulator? 8080
? Which port do you want to use for the storage emulator? 9199
? Would you like to enable the Emulator UI? Yes
? Which port do you want to use for the Emulator UI (leave empty to use any available port)? 4000
? Would you like to download the emulators now? No
```

## Enable to access firebase emulator

You have to modify `firebase/firebase.json` to enable to access.

```json
{
  "functions": {
    "source": "functions"
  },
  "emulators": {
    "functions": {
      "host": "0.0.0.0", // addition
      "port": 5001
    },
    "firestore": {
      "host": "0.0.0.0", // addition
      "port": 8080
    },
    "storage": {
      "host": "0.0.0.0", // addition
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "host": "0.0.0.0", // addition
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

## Create Cloud Storage and Firestore Database on test

In firebase web page, you have to build Cloud Storage and Firestore Database on test.

## Set storage.rules

- Create a file called `storage.rules` in the same directory as firebase.json(`/firebase`).
- Copy rules at Cloud Storage rules from your firebase project.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if
          request.time < timestamp.date(2023, 1, 12);
    }
  }
}
```

- Add rule setting to `/firebase.json`

```json
  "storage": {
    "rules": "storage.rules" // addition
  },
  "emulators": {
  ...
```

## Enable Speech to Text API

You have to enable [Cloud speech to Text](https://cloud.google.com/speech-to-text/docs/transcribe-api?hl=ja)

## Create Service Account to use Speech to Text API, Download secret key

You have to create service account and set Role(Cloud Speech Admin, Cloud Speech to Text service agent).

- [create_a_service_account](https://cloud.google.com/speech-to-text/docs/before-you-begin#create_a_service_account)

And you have to create secret key and download it to `./firebase`. And Rename secret key as `speechToText.json`<br>

## Enable Text to Speech API

You have to enable [Cloud Text to Speech](https://cloud.google.com/text-to-speech/docs/before-you-begin)

## Create Service Account to use Text to Speech API, Download secret key

You can skip this procedure if you've done `Create Service Account to use Speech to Text API, Download secret key`.

## Set environment_variable

You have to create .env.<br>
Please refer to .env-example.<br>

You have to create `OPENAI_API_KEY` at [openai.com](https://beta.openai.com/account/api-keys).
And uou have to create `DEEPGRAM_API_KEY` at [deepgram](https://deepgram.com/).
And uou have to create `CLOUD_CONVERT_API_KEY` at [cloudconvert](https://cloudconvert.com/).

And set ADMIN_ENV from firebase admin secret key.

```sh
ADMIN_CLIENT_EMAIL='firebase-adminsdk-OOOOO.iam.gserviceaccount.com'
ADMIN_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\n.....\n-----END PRIVATE KEY-----\n'
```

And set SPEECH_TO_TEXT_SA_ENV from speechToText service account secret key.

```sh
SPEECH_TO_TEXT_SA_CLIENT_EMAIL='firebase-adminsdk-OOOOO.iam.gserviceaccount.com'
SPEECH_TO_TEXT_SA_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\n.....\n-----END PRIVATE KEY-----\n'
```

## Watch modification to rebuild

You have to watch code modification for rebuild.

```bash
# in firebase container
cd functions
npm run build:watch
```

## Start emulator

```bash
# in firebase container
firebase emulators:start
```

You can check emulators state at `localhost:4000`.<br>
And you can access cloud function at `http://localhost:5001/${PROJECT_ID}/asia-northeast1/api/`.(e.g. `http://127.0.0.1:5001/eiei-english/asia-northeast1/api`)<br>
And you can access firestore at `localhost:8080`.<br>
[Install, configure and integrate Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)

## Deploy from Docker emulator

### Build

```bash
# in firebase container
cd functions
npm run build:watch
```

### Designate node_modules path

```bash
# in firebase container(/opt/workspace)
firebase functions:config:set node.module_path=./functions/node_modules/
```

### Override environment variable

[Deploying multiple sets of environment variables](https://firebase.google.com/docs/functions/config-env#deploying_multiple_sets_of_environment_variables)
Create .env.`YOUR PROJECT` to set environment variable for production.

```bash
IS_DEV=
```

### Create Firestore Collection

Create Firestore Collection along with `functions/src/consts/collections.ts`.

### Deploy

```bash
firebase deploy --only functions
```

### Modify Firestore rules

Default Firestore rules don't allow to save your data.
That's why you need to change Firestore rules as following.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

### Modify Cloud Storage rules

To access from only firebase, Modify Cloud Storage rules.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

## Supplements

### Add Firebase Rules System(Option)

To confirm storage and firestore access authorization, You have to add Firebase Rules System to your account.

At IAM page of GCP, please add `Firebase Rules System` to your account.

You can check access authorization at Cloud storage access authorization at GCP page.
[ACL](https://cloud.google.com/storage/docs/access-control/create-manage-lists#set-an-acl)

If you play audio at Cloud storage, please add access token to that content.

### Listen ChatGpt Answer

If you want to listen chatgpt answer audio, you have to create access token with audio file at Cloud Storage.
