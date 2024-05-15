// #!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from '@faker-js/faker';
// Customer Class
class Customer {
    constructor(firstName, lastName, age, gender, mobileNumber, accountNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
        this.mobileNumber = mobileNumber;
        this.accountNumber = accountNumber;
    }
}
// Class Bank
class Bank {
    constructor() {
        this.customers = [];
        this.accounts = [];
    }
    addCustomer(obj) {
        this.customers.push(obj);
    }
    addAccount(obj) {
        this.accounts.push(obj);
    }
    transaction(accountNumber, newBalance) {
        const accountIndex = this.accounts.findIndex(acc => acc.accountNumber === accountNumber);
        if (accountIndex !== -1) {
            this.accounts[accountIndex].accountBalance = newBalance;
        }
        else {
            console.log(chalk.red.bold.italic("Account not found"));
        }
    }
}
const myBank = new Bank();
// Customer creation
for (let i = 1; i <= 3; i++) {
    const firstName = faker.person.firstName('male');
    const lastName = faker.person.lastName();
    const mobileNumber = parseInt(faker.string.numeric('3##########'));
    const cus = new Customer(firstName, lastName, 25 * i, "male", mobileNumber, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccount({ accountNumber: cus.accountNumber, accountBalance: 100 * i });
}
// Bank Functionality
async function bankService(bank) {
    while (true) {
        const { service } = await inquirer.prompt({
            name: 'service',
            type: 'list',
            message: 'What service do you want to use?',
            choices: ['Deposit', 'Withdraw', 'Balance Enquiry', 'Exit']
        });
        if (service === 'Exit') {
            break;
        }
        if (service === 'Balance Enquiry') {
            const { accountNumber } = await inquirer.prompt({
                type: "input",
                name: "accountNumber",
                message: "Enter your Account Number: "
            });
            const account = bank.accounts.find(acc => acc.accountNumber === parseInt(accountNumber));
            if (!account) {
                console.log(chalk.red.bold.italic("Account Number not found"));
            }
            else {
                const customer = bank.customers.find(cus => cus.accountNumber === parseInt(accountNumber));
                console.log(`Dear ${chalk.green.italic(customer?.firstName)} ${chalk.green.italic(customer?.lastName)}, your Account Balance is ${chalk.bold.blueBright("$" + account.accountBalance)}`);
            }
        }
        if (service === 'Withdraw' || service === 'Deposit') {
            const { accountNumber } = await inquirer.prompt({
                type: "input",
                name: "accountNumber",
                message: "Enter your Account Number: "
            });
            const account = bank.accounts.find(acc => acc.accountNumber === parseInt(accountNumber));
            if (!account) {
                console.log(chalk.red.bold.italic("Account Number not found"));
            }
            else {
                const { amount } = await inquirer.prompt({
                    type: "number",
                    message: `Please enter your ${service === 'Withdraw' ? 'withdrawal' : 'deposit'} amount.`,
                    name: "amount",
                });
                if (service === 'Withdraw' && amount > account.accountBalance) {
                    console.log(chalk.red.bold("Insufficient Balance."));
                }
                else {
                    const newBalance = service === 'Withdraw' ? account.accountBalance - amount : account.accountBalance + amount;
                    bank.transaction(parseInt(accountNumber), newBalance);
                    console.log(chalk.green.bold(`Transaction Successful. Your new balance is $${newBalance}`));
                }
            }
        }
    }
}
bankService(myBank);
