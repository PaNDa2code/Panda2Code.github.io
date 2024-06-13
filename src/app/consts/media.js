import proxy from "../proxies/media"

const media = {
    discord: {
        id: "907685833988001862",
        tag: "@panda2code",
    },
    stackOverflow: {
        id: "22814262",
        name: "Panda",
    },
    github: "panda2code",
    // figma: "elias_dev",
    // replit: "EliasDev",
    // codewars: "EliasDevis",
    // devTo: "eliasdevis",
    // cssBattle: "elias_dev",
    // codepen: "elias_dev",
    // dribble: "Elias_dev",
    email: "MoaazBahaa@protonmail.com"

}

export default new Proxy(media, proxy);

