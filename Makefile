
user-shell := docker-compose run --rm -e LOCAL_USER_ID=`id -u $$USER` -e LOCAL_GROUP_ID=`id -g $$USER` djanghi-ui

build:
	docker-compose down
	docker-compose up --build

shell:
	$(user-shell) sh

lock:
	$(user-shell) sh -c "npm i --package-lock-only"

install:
	$(user-shell) sh -c "npm install"

audit:
	$(user-shell) sh -c "npm audit fix --force"

fund:
	$(user-shell) sh -c "npm fund"

runserver:
	docker-compose up --force-recreate djanghi-ui
