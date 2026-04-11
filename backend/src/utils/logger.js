import chalk from "chalk"

export const log = (message, type)=>{
    if(type==="error"){
        console.log(chalk.red(`${new Date().toISOString()} ${message}`));
    }
    else if(type==="info"){
        console.log(chalk.blue(`${new Date().toISOString()} ${message}`));
    }
    else{
        console.log(chalk.green(`${new Date().toISOString()} ${message}`));
    }
}
