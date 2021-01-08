module.exports = {
    "plugins": [
        require('tailwindcss')('tailwind.js'),
        // require('autoprefixer')(),
        require('postcss-preset-env')({stage: 1})
    ]
}
