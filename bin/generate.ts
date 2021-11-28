import * as fs from 'fs';
import { resolve } from 'path';
import Twig from 'twig';
import { program } from 'commander';
import { pascal, camel } from 'case';

program.version('0.0.1');

Twig.extendFilter('toLowerCase', (text: string) => text.toLocaleLowerCase());

program.command('service <name>').action((name) => {
	try {
		const files = fs.readdirSync(resolve(__dirname, 'templates'));
		const dir = fs.mkdirSync(
			resolve(__dirname, '..', 'src', 'services', camel(name)),
			{
				recursive: true,
			},
		);

		if (!dir) {
			console.error(`directory ${dir} cannot be created`);
			return;
		}

		files.forEach((file) => {
			const filename = resolve(__dirname, 'templates', file);
			const data = fs.readFileSync(filename).toString();
			const template = Twig.twig({ data });
			const rendered = template.render({
				pascalName: pascal(name),
				camelName: camel(name),
			});

			const pathSegments = file.replace('.twig', '.ts');
			fs.appendFileSync(resolve(dir, pathSegments), rendered);
			console.log(`file ${pathSegments} created`);
		});
	} catch (e) {
		console.error(e);
	}
});

program.parse(process.argv);
