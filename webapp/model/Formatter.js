sap.ui.define(["sap/ui/core/format/NumberFormat"],
    function (NumberFormat){
        return {
            currency:function(cur){
                // cinst =currency instance
                let cinst =NumberFormat.getCurrencyInstance();
                return cinst.format(cur,"EUR")
            },
            parseDate:function(date){
                if (typeof date=="string"){
                    date =new Date(date);
                }
                if(!date) return ''
                const map_month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                let month =map_month[date.getMonth()];
                let year =date.getFullYear();
                let date_ = date.getDate()
                return date_+" "+month+", "+year;
            },
            _checkType:function(label=false){
                if (typeof label=="boolean"){
                    return true;
                }
                return false;
            },
            pContinued_:function(label){
                if (typeof label=="boolean"){
                    return !label?"sap-icon://sys-enter-2":"sap-icon://cancel"
                } 
            },
            pContinued_state:function(label){
                if (typeof label=="boolean"){
                    return !label?"Success":"Warning"
                } 
            },
            pContinued_text:function(label){
                if (typeof label=="boolean"){
                    return !label?"In Stock":"Out Of Stock"
                }
            },
            employeeStatus:function(num){
                // console.log(num);
                return num?"Success":"Warning"
            },
            emptyDataHandle:function(data){
                // console.log(data);
                return data!=null?data:"-"
            },
            object_state:function(num){
                console.log(typeof num);
                return num?"None":"Warning"
            }
            }
        }
    );