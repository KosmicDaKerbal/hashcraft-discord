/*
NODEJS HTTPS LIBRARY

        http.get('http://server.duinocoin.com/v2/users/' + interact.options.get('account-name').value, (res) => {
        let data = '';
        res.on ('data', (chunk) =>  {
        data += chunk;
        });
        res.on('end', async () => {
            console.log(data);
            const json = JSON.parse(data);
            if (json.success){
                await interact.editReply("Confirm Account Link: " + String(interact.options.get('account-name').value));
            } else {
                await interact.editReply("Error: " + String(json.message));
            }
        });
    })
    .on('error', (e) => {
        console.log (e);
    })*/



        /*
        AXIOS


        axios.get('https://server.duinocoin.com/v2/users/' + interact.options.get('account-name').value)
        .then((response) => {
        console.log(response.data);
        })
        .catch((error) => {
        console.error(error);
        });
        */

        