import { useEffect, useState, useCallback, useContext } from "react";
import { ThemeContext } from "../main";

function Body() {
   const [profiles, setProfiles] = useState([]);
   const [numberofProfile, setNumberofProfile] = useState("");
   const [searchQuery, setSearchQuery] = useState("");
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);
   const [sortOrder, setSortOrder] = useState('asc');
   const { theme } = useContext(ThemeContext);

   const generateProfile = useCallback(async (count) => {
      try {
         setLoading(true);
         setError(null);
         const ran = Math.floor(1 + Math.random() * 10000);
         const response = await fetch(`https://api.github.com/users?since=${ran}&per_page=${count}`);
         if (!response.ok) throw new Error('Failed to fetch profiles');
         const data = await response.json();
         setProfiles(data);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   }, []);

   const searchUser = useCallback(async () => {
      if (!searchQuery.trim()) return;
      try {
         setLoading(true);
         setError(null);
         const response = await fetch(`https://api.github.com/users/${searchQuery}`);
         if (!response.ok) {
            if (response.status === 404) {
               throw new Error('User not found');
            }
            throw new Error('Failed to fetch user');
         }
         const data = await response.json();
         setProfiles([data]);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   }, [searchQuery]);

   const handleSort = useCallback(() => {
      const sorted = [...profiles].sort((a, b) => {
         const comparison = a.login.localeCompare(b.login);
         return sortOrder === 'asc' ? comparison : -comparison;
      });
      setProfiles(sorted);
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
   }, [profiles, sortOrder]);

   const handleKeyPress = useCallback((e) => {
      if (e.key === 'Enter') {
         searchUser();
      }
   }, [searchUser]);

   useEffect(() => {
      generateProfile(10);
   }, [generateProfile]);

   return (
      <div className={`but ${theme}`}>
         <div className="search-container">
            <input 
               type="text" 
               className="inpu" 
               placeholder="Number of profiles (max 100)" 
               value={numberofProfile} 
               onChange={(e) => setNumberofProfile(e.target.value)}
            />
            <button onClick={() => generateProfile(Math.min(Number(numberofProfile), 100))}>
               Generate Profiles
            </button>
         </div>
         
         <div className="search-container">
            <input 
               type="text" 
               className="inpu" 
               placeholder="Search username" 
               value={searchQuery} 
               onChange={(e) => setSearchQuery(e.target.value)}
               onKeyPress={handleKeyPress}
            />
            <button onClick={searchUser}>Search User</button>
            {profiles.length > 1 && (
               <button onClick={handleSort}>
                  Sort {sortOrder === 'asc' ? '↑' : '↓'}
               </button>
            )}
         </div>

         {loading && <div className="loading">Loading profiles...</div>}
         {error && <div className="error">{error}</div>}
         
         <div className="profiles">
            {profiles.map((value) => (
               <div key={value.id} className="cards">
                  <img src={value.avatar_url} alt={value.login} />
                  <div className="profile-details">
                     <h2>{value.login}</h2>
                     <a href={value.html_url} target="_blank" rel="noopener noreferrer">
                        View Profile
                     </a>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default Body;


