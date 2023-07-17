# Rage Page

_What better way to gauge what enrages people at work, than by putting it into a page?_

## Overview

_This project was inspired by [Peter Seibel and his discussion on Engineering Enablement](https://open.spotify.com/episode/3w37eVMog8fGcJFzKtI8eM?si=7298fd90e1e7408d)._

This is a project designed to be able to easily collect data on the less savoury parts of working at a given place. This kind of data is often missed in other survey type collections, as survey questions are often on how you relate to matters above you in management, but less often how you relate to matters horizontally in an organisation.

A common survey question may be: _"Do you feel like you can have open discussions with your boss?"_ but when is the last time you were asked a survey question about _"How much time do you spend trying to find documentation each week?"_

## How it works

The applciation is very simple, it consists of 2 containers:

1. A front-end React app written in TypeScript
1. A [SurrealDB](https://surrealdb.com) container to store the results. This container stores the data to disk via a volume mounted at `/backend/mydatabase.db`

When a user browses to the frontend, they are greeted with a simple page featuring a text box and a button.

They type in whatever it is that they want to rage about and click the "Send Rage" button

This sends the text and the time it was sent into the SurrealDB container, where it is stored in a "complaints" table.

Someone with permissions is then able to see this information when browsing to "/admin" and inputting a password.

On the admin site, they are able to see all of the submitted rage, and create or update the tags for a particular complaint.

They can then see a graph of the number of tags submitted over time.

## Why it works

There are **low administrative overheads** associated with getting feedback this way. There is no large survey to curate and parse responses to. All it requires is enough people to be annoyed about something to speak up about it.

Submitting feedback in this way is **anonymous** when names are removed we get a more unfiltered opinion about what people really think. Sometimes the thing making people rage is a process, team or individual. Making this anonymous reduced repercussions for speaking out.

The design is for complaints to be **open-ended**. A sinble complaint could be tagged in multiple different ways. There is no inherent "ranking" to the order in which a complaint is tagged.

It makes it easy to see **trending over time**. Perhaps a common complaint related to the speed of builds. If a change is made to improve the speed of builds, you would expect to see the incidence of complaints tagged with "build speed" to decrease over time.

It makes it easy to **prioritise what's important**. Reducing the guesswork in "what do people want us to focus on" and instead having some evidence to say "enough people are annoyed about this" that ranking what to tackle becomes much easier.

## Installation / Usage Guide

### Development

First time setup:

1. Clone this repo
1. Copy the `/.env.template` file and rename it to `.env`. This should be placed in the root folder at the same level as `docker-compose.ymnl`. This file is used to pass values to the SurrealDB container as authentication on startup. There are 2 lines that should go into this file (replace `< SECRET_n >` with a value of your choosing):
    - `SURREAL_USER_ROOT=< SECRET_1 >` - Used as the username for starting the surrealdb backend as root.
    - `SURREAL_PASS_ROOT=< SECRET_2 >` - Used as the password for starting the surrealdb backend as root.
1. Copy the `/frontend/.env.template` file and rename it to `.env.local`. This should be placed in the _frontend_ folder at the same level as `index.html`. This file is used to track secrets required throughout the frontend and stop them from being hard-coded. There are 3 lines that should go into this file (replace `< SECRET_n >` with a value of your choosing):
    - `VITE_ADMIN_PASSWORD=< SECRET_3 >` - Used as the admin password people need to enter to be able to tag and graph complaints.
    - `VITE_SURREAL_NAMESPACE=< VALUE_1 >` - Used as the namespace for the database. This does not need to be secret. E.g. 'test' or 'namespace1' are fine. This is defaulted to `ns`.
    - `VITE_SURREAL_DATABASE=< VALUE_2 >` - Used as the database name. This does not need to be secret. E.g. 'test' or 'database1' are fine. This is defaulted to `db`.
    - `VITE_SURREAL_URL=< VALUE_3 >` - Used as the URL for the backend. This is defaulted to `http://localhost:9000`.
1. Run `make first` to create the containers and install dependencies.
1. Import the basic schema for the tables and user scopes. This can be done using their [CLI tool to import from file](https://surrealdb.com/docs/cli/import) or making a [web request against the REST endpoint](https://surrealdb.com/docs/integration/http#import). (The import file contains a list of SQL queries to be made).
    - **Note** The admin password must be changed in `import.surql` file. This will need to match the value set as the _VITE_ADMIN_PASSWORD_ above or the requests on the admin page will not work. On line 62 of `import.surql`: `crypto::argon2::generate('REPLACE_ME')`, replace _REPLACE_ME_ with the value of _VITE_ADMIN_PASSWORD_ before running the import.
    - There is also a ThunderClient collection which includes a pre-populated import request, or a request to specifically make the users. These can be used (through ThunderClient in VSCode or adjusting them to suit another client) and have the requests run that way. Both releavant requests will still need to have the value for the admin password replaced.

Doing development:

Once the first time setup steps are complete, run `make start` to start docker-compose and run both containers.

Make any changes required in the files, hot-reloading works on both windows and mac.

When finished, shutdown the containers with `make stop`

## Contributing

Currently this is a hobby project. Any feedback / contributions welcome.
