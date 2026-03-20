
async function test() {
  const fields = ['name', 'capital', 'currencies', 'flags', 'population', 'region', 'subregion', 'tld', 'languages', 'borders', 'cca3'];
  const url = `https://restcountries.com/v3.1/all?fields=${fields.join(',')}`;
  console.log('Testing URL with 11 fields:', url);
  try {
    const r = await fetch(url);
    const data = await r.json();
    if (r.ok) {
      console.log('Success! Data length:', Array.isArray(data) ? data.length : 'Not an array');
    } else {
      console.log('Failed with status:', r.status);
      console.log('Message:', data.message);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
