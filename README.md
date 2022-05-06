# Djanghi UI
Djanghi is a project to help communities manage their membership and have a centralized place to manage payments and gatherings.
This is UI portion requires it sibling backend `Django` in order to fully operates.
This build with `React` and `NodeJs 16 alpine`

## Installation an initialization

Prerequisite to run this project is having `docker` and docker-compose` installed on your machine and being able to run `Make` command.

To pull and build the required containers just run the following command in the root directory:

```
make build
```

To install the required packages run

```
make install
```

To regenerate package-lock.json run

```
make lock
```

To start the local server run

```
make runserver
```
