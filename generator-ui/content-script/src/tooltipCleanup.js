// if orphaned script is present we remove its associated tooltip element
const orphaned_element = document.getElementById("floating-tooltip");
if (orphaned_element) {
  orphaned_element.remove();
}