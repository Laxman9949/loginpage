function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("active");
}


// 1. Scroll Reveal with IntersectionObserver (Better Performance)
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      // Optional: Stop observing once revealed
      // observer.unobserve(entry.target); 
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));


// 2. 3D Tilt Effect for Cards (Mouse Movement)
const cards = document.querySelectorAll(".card, .testimonial-card");

cards.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10deg to 10deg)
    const xRotate = ((y / rect.height) - 0.5) * -10; 
    const yRotate = ((x / rect.width) - 0.5) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
});


// Modal Functions
function openDemoModal() {
  const modal = document.getElementById("demoModal");
  if (modal) modal.style.display = "block";
}

function closeDemoModal() {
  const modal = document.getElementById("demoModal");
  if (modal) modal.style.display = "none";
}

function openCreateTestModal() {
  const modal = document.getElementById("createTestModal");
  if (modal) modal.style.display = "block";
}

function closeCreateTestModal() {
  const modal = document.getElementById("createTestModal");
  if (modal) modal.style.display = "none";
}

function openForgotPasswordModal() {
  const modal = document.getElementById("forgotPasswordModal");
  if (modal) modal.style.display = "block";
}

function closeForgotPasswordModal() {
  const modal = document.getElementById("forgotPasswordModal");
  if (modal) modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
  const demoModal = document.getElementById("demoModal");
  const createModal = document.getElementById("createTestModal");
  const forgotModal = document.getElementById("forgotPasswordModal");
  
  if (event.target == demoModal) {
    demoModal.style.display = "none";
  }
  if (event.target == createModal) {
    createModal.style.display = "none";
  }
  if (event.target == forgotModal) {
    forgotModal.style.display = "none";
  }
}

// Dynamic Question Adding
let questionCount = 0;

function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    const div = document.createElement('div');
    div.className = 'question-card';
    div.innerHTML = `
        <div class="question-header">
            <h4>Question ${questionCount}</h4>
            <button type="button" class="btn-sm btn-danger action-btn" onclick="this.closest('.question-card').remove()">
                🗑️ Remove
            </button>
        </div>
        <div class="form-group">
            <label>Question Text</label>
            <input type="text" name="question_text_${questionCount}" required placeholder="e.g., What is the capital of France?">
        </div>
        <div class="options-grid">
            <div class="form-group">
                <label>Option A</label>
                <input type="text" name="option_a_${questionCount}" required placeholder="Answer A">
            </div>
            <div class="form-group">
                <label>Option B</label>
                <input type="text" name="option_b_${questionCount}" required placeholder="Answer B">
            </div>
            <div class="form-group">
                <label>Option C</label>
                <input type="text" name="option_c_${questionCount}" required placeholder="Answer C">
            </div>
            <div class="form-group">
                <label>Option D</label>
                <input type="text" name="option_d_${questionCount}" required placeholder="Answer D">
            </div>
        </div>
        <div class="form-group">
            <label>Correct Answer</label>
            <select name="correct_option_${questionCount}" required>
                <option value="" disabled selected>Select Correct Option</option>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
            </select>
        </div>
    `;
    container.appendChild(div);
    
    // Smooth scroll to the new question
    div.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Handle Create Test Form Submission
document.getElementById('createTestForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const questions = [];
    const questionCards = document.querySelectorAll('.question-card');
    
    // Extract questions manually since we used dynamic names
    questionCards.forEach((card, index) => {
        // Find inputs within this specific card
        const qIndex = index + 1; // Or find a more robust way if removing messes up indices
        // Better: iterate over inputs in the card
        const text = card.querySelector('input[name^="question_text"]').value;
        const optA = card.querySelector('input[name^="option_a"]').value;
        const optB = card.querySelector('input[name^="option_b"]').value;
        const optC = card.querySelector('input[name^="option_c"]').value;
        const optD = card.querySelector('input[name^="option_d"]').value;
        const correct = card.querySelector('select[name^="correct_option"]').value;
        
        questions.push({
            question_text: text,
            option_a: optA,
            option_b: optB,
            option_c: optC,
            option_d: optD,
            correct_option: correct
        });
    });
    
    const payload = {
        title: formData.get('title'),
        description: formData.get('description'),
        duration: formData.get('duration'),
        total_marks: formData.get('total_marks'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        questions: questions
    };
    
    try {
        const response = await fetch('/create-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (response.status === 401) {
            alert('Your session has expired. Please login again.');
            window.location.href = '/login';
            return;
        }

        const result = await response.json();
        
        if (result.success) {
            alert('Assessment created successfully!');
            closeCreateTestModal();
            // Reload dashboard if on dashboard page
            if (window.location.pathname.includes('dashboard')) {
                loadAssessments();
            } else {
                window.location.href = '/dashboard';
            }
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the assessment.');
    }
});

// Dashboard: Load Stats
async function loadStats() {
    try {
        const response = await fetch('/dashboard-stats');
        if (response.status === 401) return;
        
        const data = await response.json();
        if (data.success) {
            document.getElementById('statTotal').textContent = data.stats.total_exams;
            document.getElementById('statActive').textContent = data.stats.active_exams;
            document.getElementById('statStudents').textContent = data.stats.students_count;
            document.getElementById('statPending').textContent = data.stats.pending_reviews;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Dashboard: Load Assessments
async function loadAssessments() {
    loadStats(); // Load stats when loading assessments
    
    const tableBody = document.querySelector('#assessmentTable tbody');
    if (!tableBody) return; // Not on dashboard page
    
    try {
        const response = await fetch('/manage-assessments');
        
        if (response.status === 401) {
             window.location.href = '/login';
             return;
        }

        const data = await response.json();
        
        if (data.success) {
            tableBody.innerHTML = '';
            if (data.assessments.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; color: #64748b;">No assessments found. Create one to get started!</td></tr>';
                return;
            }
            
            data.assessments.forEach(test => {
                const row = `
                    <tr>
                        <td style="font-weight: 500;">${test.title}</td>
                        <td>${new Date(test.start_date).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})}</td>
                        <td>${test.duration} mins</td>
                        <td><span class="status-badge status-${test.status}">${test.status.charAt(0).toUpperCase() + test.status.slice(1)}</span></td>
                        <td>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="action-btn" title="View" onclick="alert('View feature coming soon')">👁️</button>
                                <button class="action-btn" title="Edit" onclick="alert('Edit feature coming soon')">✏️</button>
                                ${test.status === 'draft' 
                                    ? `<button class="action-btn" title="Publish" style="color: #16a34a;" onclick="updateStatus(${test.id}, 'publish')">🚀</button>` 
                                    : `<button class="action-btn" title="Unpublish" style="color: #ea580c;" onclick="updateStatus(${test.id}, 'unpublish')">⏸️</button>`
                                }
                                <button class="action-btn delete" title="Delete" onclick="deleteAssessment(${test.id})">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error loading assessments:', error);
    }
}

// Dashboard: Update Status / Delete
async function updateStatus(id, action) {
    if (!confirm(`Are you sure you want to ${action} this assessment?`)) return;
    
    try {
        const response = await fetch(`/assessment/${id}/${action}`, { method: 'POST' });
        
        if (response.status === 401) {
            alert('Your session has expired. Please login again.');
            window.location.href = '/login';
            return;
        }

        const result = await response.json();
        
        if (result.success) {
            loadAssessments();
            showAlert(result.message, 'success');
        } else {
            showAlert(result.message, 'error');
        }
    } catch (error) {
        showAlert('An error occurred', 'error');
    }
}

async function deleteAssessment(id) {
    updateStatus(id, 'delete');
}

function showAlert(message, type) {
    const alertDiv = document.getElementById('dashboardAlert');
    if (alertDiv) {
        alertDiv.textContent = message;
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.display = 'block';
        setTimeout(() => alertDiv.style.display = 'none', 3000);
    } else {
        alert(message);
    }
}

// Nav Brand Smooth Scroll Logic
document.addEventListener('DOMContentLoaded', () => {
  const navBrand = document.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.addEventListener('click', (e) => {
      // Check if we are currently on the home page
      const currentPath = window.location.pathname;
      // Index renders at / or /index
      if (currentPath === '/' || currentPath === '/index' || currentPath.endsWith('index.html')) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Remove hash from URL to keep it clean
        if (window.location.hash) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
      }
    });
  }
});
document.getElementById("createTestForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const formData = new FormData(this);

    const response = await fetch("/create-assessment", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    alert(data.message);
});

        function togglePassword(fieldId) {
            const field = document.getElementById(fieldId);
            const icon = document.getElementById(fieldId + '-icon');
            
            if (field.type === 'password') {
                field.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                field.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        function handleSignup() {
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const studentId = document.getElementById('student_id').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const role = document.getElementById('role').value;
            const terms = document.getElementById('terms').checked;

            // Validation
            if (!fullname || !email || !studentId || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            if (password.length < 8) {
                alert('Password must be at least 8 characters long');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (!terms) {
                alert('Please accept the terms and conditions');
                return;
            }

            // Create form data
            const formData = new FormData();
            formData.append('fullname', fullname);
            formData.append('email', email);
            formData.append('student_id', studentId);
            formData.append('password', password);
            formData.append('confirm_password', confirmPassword);
            formData.append('role', role);

            // Submit form
            fetch('/signup', {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    return response.text();
                }
            }).then(html => {
                if (html) {
                    document.open();
                    document.write(html);
                    document.close();
                }
            });
        }

        // Enter key support
        document.addEventListener('DOMContentLoaded', function() {
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        handleSignup();
                    }
                });
            });
        });
