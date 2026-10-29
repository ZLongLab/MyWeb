import "../../assets/articles-data.js";
import "../../assets/garden-data.js";
import "../../assets/house-data.js";
import "../../assets/life-data.js";
import "../../assets/projects-data.js";
import "../../assets/site-data.js";
import "../../assets/site-snapshot.js";
import "../../assets/timeline-data.js";
import "../../assets/workbench-data.js";
// Canonical editable data stays in assets so offline maintenance generators keep working.
export const site = window.SITE_DATA;
export const house = window.SITE_HOUSE;
export const workbench = window.SITE_WORKBENCH;
// New React modules read the shared catalog through imports; legacy controllers
// keep their compatibility globals until each module is converted independently.
export const projects = window.SITE_PROJECTS;
export const articles = window.SITE_ARTICLES;
