deploy:
	npm run build
	firebase deploy

test:
	npm run build
	npm run test