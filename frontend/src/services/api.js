const BASE_URL = "http://127.0.0.1:8000";

export async function planTrip(data){

    const response = await fetch(`${BASE_URL}/plan-trip`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    return await response.json();
}