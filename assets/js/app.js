d3.csv("data.csv", function(error, data) {
    console.log(data);
    if (error) throw error;
});