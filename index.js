import figlet from 'figlet';
import gradient from 'gradient-string';
import prompts from 'prompts';
import chalk from 'chalk'
import fs from "fs"
import { exec } from "child_process";

console.clear()

const tailwindContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`


const appContent = `<template>
    <div class="flex justify-center items-center w-full h-screen font-mono underline text-xl">
        Hello Louis!
    </div>
</template>`

const styleContent = `@tailwind base;
@tailwind components;
@tailwind utilities;`

async function writeFile(path, text) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, text, err => {
            if (err) reject()
            resolve()
        });
    })
}


//DEBUG
var dir = './test';
fs.rmSync(dir, { recursive: true, force: true });


await new Promise(function (resolve, reject) {
    figlet("Welcome!", (err, data) => {
        if (err) reject()
        console.log(gradient.mind.multiline(data))
        resolve()
    })
})

const projectName = await prompts({
    type: 'text',
    name: "value",
    message: chalk.blue.bold("What's the name of your future masterpiece ?"),
    initial: "test"
});

if (fs.existsSync(projectName.value)) {
    console.log(chalk.red('Provided directory already exists'))
    process.exitCode = 1;
    throw new Error();
}

const projectFramework = await prompts([
    {
        type: 'select',
        name: 'value',
        message: chalk.blue('Pick a framework'),
        choices: [
            { title: 'Vite', description: 'https://vitejs.dev/guide/', value: "vite" },
            { title: 'Nuxt', description: 'https://nuxt.com/docs/getting-started/installation', value: "nuxt" }
        ],
        initial: 0
    }
]);

if (projectFramework.value == "vite") {
    await new Promise(function (resolve, reject) {
        exec(`npm create vite@latest ${projectName.value} -- --template vue-ts`, { cwd: './' }, function (err, stdout, stderr) {
            if (err) reject()
            resolve()
        });
    })
    fs.rmSync(`./ ${projectName.value} / src / components`, { recursive: true, force: true });
    console.log(chalk.green("  Vite project created!"))
}

await new Promise(function (resolve, reject) {
    exec(`npm install -D tailwindcss postcss autoprefixer`, { cwd: `./${projectName.value}` }, function (err, stdout, stderr) {
        if (err) reject()
        resolve()
    });
})

await new Promise(function (resolve, reject) {
    exec(`npx tailwindcss init -p`, { cwd: `./${projectName.value}` }, function (err, stdout, stderr) {
        if (err) reject()
        resolve()
    });
})

await new Promise(function (resolve, reject) {
    fs.writeFile(`./${projectName.value}/tailwind.config.cjs`, tailwindContent, err => {
        if (err) reject()
        resolve()
    });
})

await new Promise(function (resolve, reject) {
    fs.writeFile(`./${projectName.value}/src/App.vue`, appContent, err => {
        if (err) reject()
        resolve()
    });
})

await new Promise(function (resolve, reject) {
    fs.writeFile(`./${projectName.value}/src/style.css`, styleContent, err => {
        if (err) reject()
        resolve()
    });
})

await new Promise(function (resolve, reject) {
    exec(`code ./${projectName.value}`, function (err, stdout, stderr) {
        if (err) reject()
        resolve()
    });
})
console.log(chalk.green("  Tailwind added!"))
console.log(chalk.green("  Opening vscode..."))
