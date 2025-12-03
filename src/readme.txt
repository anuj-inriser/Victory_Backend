                                Victory / Stock Market App Backend 

how to run project- npm run dev -> (command for running the project)
if there's an error - try running command -> npm i

controllers: 
1: get/get{MasterName}= for fetching  {Masters} data (@calltype =1)
4: (get/:id)/getById{MasterName}/get{MasterName}ById = for fetching particular user data by id from {Masters} (@calltype =2)
2: post/create{MasterName} = for creating {Masters} in the database  (@calltype =3)
3: (put/:id)/update{MasterName} = for updating {Masters} in the database  (@calltype =4)
5: (delete/:id)/delete{MastersName} = for deleting data from {Masters}  (@calltype =5)
            
Made an error Handler {middleware/errorHandler.js and utils/appError.js} for error handling and status code 

Made an connection string {db.js/getPool} everywhere --this getPool will be used wherever conection is required

syntax of calling procedure = Call procedure_Name($1) -($ for how many parameters you want to send )
                              [json.stringify(data)]=> the value of parameters you are sending 

// we have used model of every Master so that we dont need it in js because JS will know from database schema 
(we used constructor & classes for model in  typescript we uses simple interface model)

for file(document) saving we used MULTER -which is a middleware that processes file because express cant read file
directly......the FLOW - the req will come from the ui with data that contains file/document also 
-upload middleware will save that file in folder and change its name that will be stored in database and through
 that name the file will be accessed, the file of agreement is saved into agreements folder and file of  
document is saved into documents folder ,we generated the filename by ourself ,the naming convention is based on -> 
U{userid}-A{agreementIndexNo.}-filename for agreements 
U{userid}-D{documentsIndexNo.}-filename for documents 

//for saving agreements and documents we used byte array => we made an common function (file.utils.js) for decoding the byte  
array which is coming from frontend ,then we are saving that file into uploads folder which has folders based on users{userid's} 
in which there is 2 folder (agreements & documents) 

