module.exports = app => {

    const arquivoCaixaMedicamento = (req,res) => {
        
            const filePath = `C:/Users/carlo/Desktop/EspComIdentificadorQueda - Carlos/EspComIdentificadorQueda/esp.bin`
            
            res.download(filePath);   
        
    }
    const arquivoSistemaQueda = (req,res) => {
        
        const filePath = `C:/Users/carlo/Desktop/EspComIdentificadorQueda - Carlos/EspComIdentificadorQueda/esp.bin`
        
        res.download(filePath);   
    
    }   

    return {arquivoCaixaMedicamento,arquivoSistemaQueda }

}