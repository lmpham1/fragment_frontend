// src/api.js
// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user, expand = false) {
  //console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=${expand ? 1 : 0}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data:', { data });
    return data.fragments;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function createFragmentData(user, fragmentData, type){
  console.log(`Creating new fragment...`, {fragmentData});
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      method: "POST",
      headers: {
        ...user.authorizationHeaders(),
        'Content-Type': type
      },
      body: JSON.stringify(fragmentData)
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Metadata of created fragment:', { data });
    return true;
    //window.location.reload(false)
  } catch (err) {
    console.error('Unable to call POST /v1/fragments', { err });
    return false;
  }
}

export async function getFragmentData(user, fragmentId){
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      headers: user.authorizationHeaders()
    });
    if (!res.ok){
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const contentType = res.headers.get("Content-Type");
    if (contentType.includes("text/")){
      return res.text();
    }
    else if (contentType.includes("application/json")){
      return res.json();
    } else if (contentType.includes("image/jpeg") || contentType.includes("image/png")){
      return res.body;
    }
    else {
      console.log(res.body);
      console.log(contentType);
      throw new Error("Unsupported Type");
    }
  } catch (err){
    console.log(err);
  }
}

export async function getFragmentMetadata(user, fragmentId){
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}/info`, {
      headers: user.authorizationHeaders()
    });
    if (!res.ok){
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const fragmentMetadata = await res.json();
    return fragmentMetadata;
  } catch (err){
    console.log(err);
    return undefined;
  }
}