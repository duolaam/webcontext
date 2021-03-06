
const Emitter = require('events');
const mysql=require("mysql")

module.exports = class DataBase extends Emitter {
    constructor(options) {
       
       super();

       var connection = mysql.createConnection(options);
       connection.connect();
       this.connection=connection;
    }


    query(sql,params){
        return new Promise(  (resolve,reject)=>{
            this.connection.query(sql,params,function (error, results, fields) {
                if (error) {
                    reject(error);
                    throw error;
                }else{
                    resolve(results);
                }
              })
            
        })
       
    }
    exists(table,columns){
        return new Promise(function (resolve){

        
            var data=[],c1=[];
            for(let key in columns){
                data.push(columns[key]);
                c1.push(key+"=");
                c1.push("?");
            }
            var sql="select count(*) from "+table+" where "+c1.join(",")+";" 
            this.query(sql,data).then(function (result){
                resolve(result)
            })

        })
    }

    select(tableName,options){
        var sql="";
        var columns="*";
        var data=[];
        if(!options){options={};}

        if(options.columns){
            let arr=[];
            for(let key in columns){
                arr.push(key);
            }
            columns=arr.join(",")
        }
        sql="select "+columns+" from "+tableName;

        if(options.where){
            for(let key in options.where){
                data.push(columns[key]);
                c1.push(key+"=?");

            }
            sql+=" where "+c1.join(" and ")
        }

        if(options.orderBy){
            sql+=" order by "+options.orderBy;
        }

        if(options.pageIndex){
            sql+=" limit"+options.pageIndex+","+options.pageSize;
        }

        return this.query(sql,data)
    }

    insert(tableName,columns){
        var data=[];
        var c1=[],c2=[];
        for(let key in columns){
            data.push(columns[key]);
            c1.push(key);
            c2.push("?");
        }

        return this.query("insert into "+tableName+" ("+c1.join(",")+") values("+c2.join(",")+")",data)
    }

    replace(tableName,columns){
        var data=[];
        var c1=[],c2=[];
        for(let key in columns){
            data.push(columns[key]);
            c1.push(key);
            c2.push("?");
        }

        return this.query("replace into "+tableName+" ("+c1.join(",")+") values("+c2.join(",")+")",data)
    }

    update(tableName,columns,where){
        
        var data=[];
        var c1=[],c2=[];
        for(let key in columns){
            data.push(columns[key]);
            c1.push(key+"=?");
        }
        if(columns.id){
            where={id:columns.id};
            delete columns.id;
        }
        if(where){
            for(let key in where){
                data.push(where[key]);
                c2.push(key+"=?");
            }
        }else{
            throw(new Error("where params is undefind.update(tableName,columns,where) "))
        }

        var sql="update "+tableName+" set "+c1.join(",")+" where "+c2.join(" and ");
        return this.query(sql,data);
    }

    delete(tableName,where){
        var c1=[],data=[];
        for(let key in where){
            data.push(where[key]);
            c1.push(key+"=?");
        }
        var sql="delete from "+tableName+" where "+c1.join(" and ");
        return this.query(sql,data);
    }

}

 