/* eslint-disable no-console */
const fs = require( 'fs-extra' );
const path = require( 'path' );
const promptly = require( 'promptly' );
const chalk = require( 'chalk' );

const files = [
	'._gitignore',
	'_README.md',
	'_webpack.config.js',
	'_main.php',
	'_package.json',
	'._eslintrc.js',
	'._eslintignore',
];
const maybeThrowError = ( error ) => {
	if ( error ) throw error;
};

( async () => {
	console.log( '\n' );
	console.log(
		chalk.yellow(
			'🎉 Welcome to WooCommerce Blocks Extension Starter Pack 🎉'
		)
	);
	console.log( '\n' );
	const extensionName = await promptly.prompt(
		chalk.yellow( 'What is the name of your extension?' )
	);
	const extensionSlug = extensionName.replace( / /g, '-' ).toLowerCase();
	const folder = path.join( __dirname, extensionSlug );
	let extensionClassSlug = extensionSlug.replace( /\-[a-z]/g, ( x ) =>
		x[ 1 ].toUpperCase()
	);
	extensionClassSlug = `${ extensionClassSlug
		.charAt( 0 )
		.toUpperCase() }${ extensionClassSlug.substr(
		1,
		extensionClassSlug.length - 1
	) }`;
	const extensionSlugUppercase = extensionSlug.toUpperCase();

	fs.mkdir( folder, maybeThrowError );
	files.forEach( ( file ) => {
		const from = path.join( __dirname, file );
		const to = path.join(
			folder,
			file === '_main.php'
				? `${ extensionSlug }.php`
				: file.replace( '_', '' )
		);

		fs.readFile( from, 'utf8', ( error, data ) => {
			maybeThrowError( error );

			const addSlugs = data.replace(
				/{{extension_slug}}/g,
				extensionSlug
			);

			const addClassSlugs = addSlugs.replace(
				/{{extension_class_slug}}/g,
				extensionClassSlug
			);

			const addNameSlugs = addClassSlugs.replace(
				/{{extension_name}}/g,
				extensionName
			);

			const result = addNameSlugs.replace(
				/{{extension_slug_uppercase}}/g,
				extensionSlugUppercase
			);

			fs.writeFile( to, result, 'utf8', maybeThrowError );
		} );
	} );

	fs.copy(
		path.join( __dirname, 'src' ),
		path.join( folder, 'src' ),
		maybeThrowError
	);

	fs.copy( folder, path.join( '../', extensionSlug ), ( error ) => {
		maybeThrowError( error );

		fs.remove( folder, maybeThrowError );
	} );

	process.stdout.write( '\n' );
	console.log(
		chalk.green(
			'Wonderful, your extension has been scaffolded and placed as a sibling directory to this one.'
		)
	);
} )();
