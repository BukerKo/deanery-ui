export async function get(url) {
    let response = await fetch(url);

    if (response.ok) {
        let json = await response.json();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}