const { parse } = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const readable=fs.createReadStream('transactions.csv');
const parsestream=readable.pipe(csv());
const fs=require('fs');
const request = require('request');
const csv= require('csv-parser')

let TotalBTC=0;//Total btc coin 
let TotalETH=0;//Total eth coin 
let TotalXRP=0;//Total xrp coin
let parseDate=0;
let validData=0;
let sum=0
let BTCvalue=0;
let ETHvalue=0;
let XRPvalue=0;
const secretKey='b02e1da3656f1d79990c7ffb54fdfb77f46276cf3d341c2ae2a673fe4f2909ee';

const validator=function(data){
    if(data.token==='BTC'&&data.transaction_type==='DEPOSIT'){
        TotalBTC+=+data.amount;
    }
    else if(data.token==='BTC'&&data.transaction_type==='WITHDRAWAL'){
        TotalBTC-=+data.amount;
    }
    else if(data.token==='XRP'&&data.transaction_type==='DEPOSIT'){
        TotalXRP+=+data.amount;
    }
    else if(data.token==='XRP'&&data.transaction_type==='WITHDRAWAL'){
        TotalXRP-=+data.amount;
    }
    else if(data.token==='ETH'&&data.transaction_type==='DEPOSIT'){
        TotalETH+=+data.amount;
    }
    else if(data.token==='ETH'&&data.transaction_type==='WITHDRAWAL'){
        TotalETH-=+data.amount;
    }
}


const mainFunction=function (){
    readline.question(`\n
    Enter 1:For no parameters, returns the latest portfolio value per token in USD.\n
    Enter 2:For a token, returns the latest portfolio value for that token in USD.\n
    Enter 3:For a date, returns the portfolio value per token in USD on that date.\n
    Enter 4:For a date and a token, returns the portfolio value of that token in USD on that date.\n
    
 `,(inp)=>{
     switch(inp){
         case '1':
            console.log('You have Entered 1');
             parsestream.on('data',(data)=>{
                validData++;
                validator(data);
             })
             .on('end',()=>{
             
                     console.log({TotalBTC,TotalETH,TotalXRP})
                     const url=`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD&api_key=${secretKey}`;
                     request({url:url},(error,res,body)=>{
                     if(!error&&res.statusCode==200){
                         const parseData=JSON.parse(body);
                         const BTCvalue=parseData['BTC']['USD']*TotalBTC;
                         const ETHvalue=parseData['ETH']['USD']*TotalETH;
                         const XRPvalue=parseData['XRP']['USD']*TotalXRP;

                         console.log('Total BTC USD: $'+BTCvalue.toLocaleString(),'Total ETH in USD: $'+ETHvalue.toLocaleString(),'Total XRP USD: $'+XRPvalue.toLocaleString());

                         const Totalvalue=BTCvalue+ETHvalue+XRPvalue;
                         
                         console.log('TotalValue:USD '+Totalvalue.toLocaleString(),{validData});
                     }
                     
                     readline.close();
                     })
                     
                 });
             
             
             break;
         case '2':
            console.log('You have Entered 2');
             readline.question('Enter Token:',(input2)=>{
                 const token=input2;
                 parsestream.on('data',(data)=>{
                    if(data.token===token&&data.transaction_type==='DEPOSIT'){
                        sum+=+data.amount;
                        validData++;
                    }
                    else if(data.token===token&&data.transaction_type==='WITHDRAWAL'){
                        sum-=+data.amount;
                        validData++;
                    }
                    
                 }).on('end',()=>{
                    const url=`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${secretKey}`;
                    request({url:url},(error,res,body)=>{
                    if(!error&&res.statusCode==200){
                        const parseData=JSON.parse(body);
                 
                        const Totalvalue=parseData['USD']*sum;
                        console.log('Total value of '+ input2 +': $'+Totalvalue.toLocaleString(),`, Total num token ,${validData}`);
                    }
                    })
                });
                
                 readline.close();
             })
             
             break;
         case '3':
            console.log('You have Entered 3');
            readline.question(`Enter Date? \n date must be of valid format in GMT,i.e:01 Jan 1970 00:00:00 GMT\n`,( date => {
                parseDate=Date.parse(date);
                console.log(`Date in Epoch ${parseDate/1000}`)
                parsestream.on('data',(data)=>{
                    if(parseDate/1000 >= data.timestamp){
                        validData++;
                        validator(data);
                    }
                }).on('end',()=>{
             
                    console.log({TotalBTC,TotalETH,TotalXRP})
             
                    const url=`https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=1&toTs=${parseDate/1000}&api_key=${secretKey}`;
                    const url2=`https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=USD&limit=1&toTs=${parseDate/1000}&api_key=${secretKey}`;
                    const url3=`https://min-api.cryptocompare.com/data/v2/histoday?fsym=XRP&tsym=USD&limit=1&toTs=${parseDate/1000}&api_key=${secretKey}`;
                    
                    request({url:url},(error,res,body)=>{
                        if(!error&&res.statusCode==200){
                            const parseData=JSON.parse(body);
                            BTCvalue=parseData['Data']['Data'][0]['close']*TotalBTC;
                            console.log(parseData['Data']['Data'][0]['close']);
                            console.log(`Total value of BTC $${BTCvalue.toLocaleString()}`);
                           
                            request({url:url2},(error,res,body2)=>{
                                if(!error&&res.statusCode==200){
                                    const parseData2=JSON.parse(body2);
                                    ETHvalue=parseData2['Data']['Data'][0]['close']*TotalETH;
                                    console.log(parseData2['Data']['Data'][0]['close']);
                                    console.log(`Total value of ETH $${ETHvalue.toLocaleString()}`);    

                                    request({url:url3},(error,res,body)=>{
                                        if(!error&&res.statusCode==200){
                                            const parseData=JSON.parse(body);
                                            XRPvalue=parseData['Data']['Data'][0]['close']*Xsum;
                                            console.log(parseData['Data']['Data'][0]['close']);
                                            console.log(`Total value of XRP $${XRPvalue.toLocaleString()}`);  
                                            
                                            const Totalvalue=XRPvalue+BTCvalue+ETHvalue;
                                            console.log(`Total value of all the token in date: ${date} is $:${Totalvalue.toLocaleString()}`)
                                            console.log(`Valid number of data under input date ${validData}`)
                                        }
                                        })   
                                }
                                })
                        }
                        })
                    
                         
                })
                
                readline.close();
            }));
            
             break;
         case '4':
            console.log('You have Entered 4');
            readline.question(`Enter Date? date must be of valid type in GMT,i.e:01 Jan 1970 00:00:00 GMT
            `,( date => {
                sum=0;
                parseDate=Date.parse(date);
                
                readline.question(`Enter Token:\n`,(input3=>{
                    const token=input3;
                    parsestream.on('data',(data)=>{
                        if(parseDate/1000 >= data.timestamp){
                            
                            validData++;
                            if(data.token===token&&data.transaction_type==='DEPOSIT'){
                                sum+=+data.amount;
                            }
                            else if(data.token===token&&data.transaction_type==='WITHDRAWAL'){
                                sum-=+data.amount;
                            }
                            
                        }
                    }).on('end',()=>{
                        const url=`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${token}&tsym=USD&limit=1&toTs=${parseDate/1000}&api_key=${secretKey}`;
                        request({url:url},(error,res,body)=>{
                            if(!error&&res.statusCode==200){
                                const parseData=JSON.parse(body);
                           
                                
                                
                               const BTCvalue=parseData['Data']['Data'][0]['close']*sum;
                               console.log('Total coin:',{sum});
                               console.log('In date ' + date + token +' value was:' + parseData['Data']['Data'][1]['close']);
                                        console.log('Total value of '+ input3 +': $'+BTCvalue.toLocaleString()+` for ${date}`);
                                
                            }
                        })
                    });
                    
                    readline.close();
                }))
                
            }));
            
             break;
        
         default:
             console.log('Only enter num 1-4');
             mainFunction();
     }
     
     
 });
} 
mainFunction();
