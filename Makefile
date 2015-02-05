watch:
	@watchify hhConnect.js --standalone hhConnect -o ./dist/hhConnect.js
build:
	@browserify hhConnect.js --standalone hhConnect > ./dist/hhConnect.js
	@uglifyjs ./dist/hhConnect.js --compress --source-map ./dist/hhConnect.min.map > ./dist/hhConnect.min.js
