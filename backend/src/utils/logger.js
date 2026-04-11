import chalk from "chalk"

export const log = (message, type)=>{
    if(type==="error"){
        console.log(chalk.red(`ERROR: ${new Date().toISOString()} ${message}`));
    }
    else if(type==="info"){
        console.log(chalk.blue(`INFO: ${new Date().toISOString()} ${message}`));
    }
    else{
        console.log(chalk.green(`SUCCESS: ${new Date().toISOString()} ${message}`));
    }
}
