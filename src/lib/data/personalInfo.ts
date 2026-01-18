export type SubItem = {
	name: string;
	text: string;
	content: string;
};

// Define el tipo para un item principal (que puede contener subItems o contenido directo)
export type PersonalInfoItem = {
	name: string;
	iconColor: string;
	text: string;
	isOpen: boolean;
	subItems: { [key: string]: SubItem };
	content?: string;
};

export type PersonalInfoItemsType = {
	[key: string]: PersonalInfoItem;
};

export const personalInfoItems: PersonalInfoItemsType = {
	bio: {
		name: 'bio',
		iconColor: 'text-red-500',
		text: 'bio',
		isOpen: true,
		subItems: {
			myBio: {
				name: 'my-bio',
				text: 'my-bio',
				content: '',
			},
			experience: {
				name: 'experience',
				text: 'experience',
				content: '',
			},
		},
	},
	education: {
		name: 'education',
		iconColor: 'text-blue-500',
		text: 'education',
		isOpen: true,
		subItems: {
			university: {
				name: 'university',
				text: 'university',
				content: '',
			},
			skills: {
				name: 'skills',
				text: 'skills',
				content: '',
			},
		},
	},
	interests: {
		name: 'interests',
		iconColor: 'text-green-500',
		text: 'interests',
		isOpen: false,
		subItems: {
			hobbies: {
				name: 'hobbies',
				text: 'hobbies',
				content: '',
			},
			music: {
				name: 'music',
				text: 'music',
				content: '',
			},
		},
	},
};

export type ContactItem = {
	type: 'email' | 'phone';
	value: string;
};

export const contactItems: ContactItem[] = [
	{
		type: 'email',
		value: 'imdenyl@gmail.com',
	},
];

export type CodeSnippet = {
	createdTime: string;
	stars: number;
	code: string;
	description: string;
	lang: string;
};

export const codeSnippets: CodeSnippet[] = [
	{
		createdTime: '5 months ago',
		stars: 3,
		code: `
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('¡Hola desde Express.js!');
});

app.listen(port, () => {
	console.log(\`Servidor Express.js escuchando en http://localhost:\${port}\`);
});
`,
		description: 'A simple Express server.',
		lang: 'javascript',
	},
	{
		createdTime: '9 months ago',
		stars: 8,
		code: `
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => '¡Hola desde Elysia!')
  .get('/saludo/:nombre', ({ params: { nombre } }) => \`¡Hola, \${nombre}!\`)
  .listen(3000, () => {
    console.log('Elysia escuchando en http://localhost:3000');
  });`,
		description: 'Another simple Elysia server.',
		lang: 'javascript',
	},
	{
		createdTime: '7 months ago',
		stars: 8,
		code: `SELECT nombre, email FROM usuarios WHERE edad > 30 ORDER BY nombre ASC;`,
		description: 'Just a select on SQL.',
		lang: 'sql',
	},
	{
		createdTime: '3 months ago',
		stars: 8,
		code: `import React, { useState } from 'react';

function Contador() {
  const [conteo, setConteo] = useState(0);

  return (
    <div>
      <p>Contador: {conteo}</p>
      <button onClick={() => setConteo(conteo + 1)}>Incrementar</button>
    </div>
  );
}

export default Contador;`,
		description: 'A React example',
		lang: 'jsx',
	},
	{
		createdTime: '2 months ago',
		stars: 8,
		code: `import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ContadorReactNative = () => {
  const [conteo, setConteo] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Contador: {conteo}</Text>
      <Button title="Incrementar" onPress={() => setConteo(conteo + 1)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texto: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ContadorReactNative;`,
		description: 'A React Native example.',
		lang: 'jsx',
	},
	{
		createdTime: '1 month ago',
		stars: 8,
		code: `INSERT INTO productos (nombre, precio, stock) VALUES ('Laptop Gaming', 1200.00, 50);`,
		description: 'Just an insert on SQL.',
		lang: 'sql',
	},
	{
		createdTime: '3 months ago',
		stars: 8,
		code: `DROP TABLE IF EXISTS usuarios;`,
		description: 'Just a drop table on SQL.',
		lang: 'sql',
	},
	{
		createdTime: '5 months ago',
		stars: 8,
		code: `import { drizzle } from 'drizzle-orm/pg-core';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
});`,
		description: 'A simple Drizzle orm schema.',
		lang: 'javascript',
	},
];
