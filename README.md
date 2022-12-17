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

## Download firebase project secret key

If you set authentication to firebase service, <br>
You have to use [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup).<br>

You have to create service account's credentials at firebase project <br>
and You have to download service account's credentials to `./firebase`.<br>

And Rename secret key as serviceAccountKey.json<br>
[Initialize the SDK](https://firebase.google.com/docs/admin/setup#initialize-sdk)

## Set environment_variable

You have to create .env.<br>
Please refer to .env.example.<br><br>

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
