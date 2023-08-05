import React, { useEffect, useState } from 'react';
import { contractABI, contractAddress } from '../utils/constants';

const ethers = require("ethers")

export const TransactionContext = React.createContext();

const { ethereum } = window;


const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)    
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionsContract;
}

export const TransactionProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
        keyword: '',
        message: ''
    })
    const [transactions, setTransactions] = useState([])


    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value }));
    } 

    const getAllTransactions = async () => {
        try{
            if(!ethereum) return alert('Please install metamask');
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();
            
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            })) 
            
            console.log(structuredTransactions)
            setTransactions(structuredTransactions);

        } catch(err) {
             console.log(err);
            throw new Error("No ethereum object")
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);


    const connectWallet = async() => {
        try{
            if(!ethereum) return alert('Please install metamask');
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            
            setCurrentAccount(accounts[0])
        
        } catch(err) {
            console.log(err);
            throw new Error("No ethereum object")
        }
    }

    const sendTransaction = async () => {
        try{
            if(!ethereum) return alert("Please install metamask")

            const {addressTo, amount, message, keyword} = formData;
            console.log(addressTo, amount, message, keyword);
            const transactionContract = getEthereumContract();
            console.log(transactionContract)
            const parsedAmount = ethers.utils.parseEther(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex
                }]
            })


            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            
            
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());


            
        } catch(err) {
            console.log(err);
            throw new Error("No ethereum object")
        }
    }
    
    const checkIfWalletIsConnected = async () => { 

        try{
            if(!ethereum) return alert("Please install metamask");
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            
            if(accounts.length) {
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            }
            else{
                console.log("No accounts found");
            }
        } catch(err) {
            console.log(err);
            throw new Error("No ethereum object")
        }
    }

    const checkIfTransactionsExist = async () => {
        try{
            const transactionsContract = getEthereumContract();
            const transactionCount = await transactionsContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);

        } catch(err) {
            throw new Error("No ethereum object");
        }
    }

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, sendTransaction, handleChange, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    )
}