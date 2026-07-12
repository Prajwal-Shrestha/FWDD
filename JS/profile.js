// ===================== Tabs =====================
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((btn) => btn.classList.remove("active"));
    contents.forEach((content) => content.classList.remove("active"));

    tab.classList.add("active");

    const target = document.getElementById(tab.dataset.tab);

    if (target) {
      target.classList.add("active");
    }
  });
});

// ===================== Edit Profile Modal =====================
const editBtn = document.querySelector(".edit-btn");
const modal = document.getElementById("editModal");
const closeBtn = document.querySelector(".close");
const saveBtn = document.getElementById("saveProfile");

editBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

saveBtn.addEventListener("click", () => {
  document.getElementById("profileName").textContent =
    document.getElementById("nameInput").value;

  document.getElementById("profileJob").textContent =
    document.getElementById("jobInput").value;

  document.getElementById("profileMember").textContent =
    "Member Since: " + document.getElementById("memberInput").value;

  modal.style.display = "none";
});

// ===================== Stats Card Hover =====================
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-8px)";
    card.style.transition = "0.3s";
    card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
  });
});

// ===================== Achievement Hover =====================
const achievements = document.querySelectorAll(".achievement-list li");

achievements.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.paddingLeft = "12px";
    item.style.transition = "0.3s";
  });

  item.addEventListener("mouseleave", () => {
    item.style.paddingLeft = "0";
  });
});

// ===================== Page Loaded =====================
window.addEventListener("load", () => {
  console.log("Football League Profile Loaded Successfully!");
});
