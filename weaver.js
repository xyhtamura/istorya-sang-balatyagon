document.addEventListener('DOMContentLoaded', function() {
  // Color probabilities
  const colorProbabilities = {
    'plants': 3/40,
    'happy': 7/40,
    'pain': 9/40,
    'sadness': 4/40,
    'weakness': 2/40,
    'blood': 1/40,
    'cloth-cat': 3/40,
    'stress': 1/40,
    'balanyos': 2/40,
    'nervousness': 1/40,
    'bad-mood': 5/40,
    'dalaga': 4/40,
    'napkin': 2/40,
    'refreshed': 1/40,
    'medicine': 1/40
  };

  // Woven color probabilities (5/40 for 2-color, 1/40 for 3-color)
  const colorAmountProbabilities = {
    2: 5/40,
    3: 1/40
  };

  const allColors = {
    'plants': '#81c784',
    'happy': '#fff176',
    'pain': '#e57373',
    'sadness': '#64b5f6',
    'weakness': '#ba68c8',
    'blood': '#ef5350',
    'cloth-cat': '#a5d6a7',
    'stress': '#ffb74d',
    'balanyos': '#4db6ac',
    'nervousness': '#7986cb',
    'bad-mood': '#90a4ae',
    'dalaga': '#f48fb1',
    'napkin': '#ce93d8',
    'refreshed': '#80deea',
    'medicine': '#4dd0e1'
  };

  const grid = document.getElementById('weaverGrid');
  const rows = 5;
  const cols = 8;
  let weavingActive = false;
  let weaveInterval;
  let observer;


  // Initialize grid
  function initializeGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < rows * cols; i++) {
      const square = document.createElement('div');
      square.className = 'weaver-square';
      grid.appendChild(square);
    }
  }

  // Get random solid color
  function getRandomSolidColor() {
    const rand = Math.random();
    let cumulativeProb = 0;
    
    for (const [color, prob] of Object.entries(colorProbabilities)) {
      cumulativeProb += prob;
      if (rand < cumulativeProb) {
        return color;
      }
    }
    return 'happy';
  }

  // Get either solid or woven color
  function getRandomColor() {
    const rand = Math.random();
    let cumulativeProb = 0;
    
    // Check for 2-color woven
    cumulativeProb += colorAmountProbabilities[2];
    if (rand < cumulativeProb) {
      const colors = [getRandomSolidColor(), getRandomSolidColor()];
      return {
        classes: 'woven-2',
        styles: `--color1: ${allColors[colors[0]]}; --color2: ${allColors[colors[1]]}`
      };
    }
    
    // Check for 3-color woven
    cumulativeProb += colorAmountProbabilities[3];
    if (rand < cumulativeProb) {
      const colors = [getRandomSolidColor(), getRandomSolidColor(), getRandomSolidColor()];
      return {
        classes: 'woven-3',
        styles: `--color1: ${allColors[colors[0]]}; --color2: ${allColors[colors[1]]}; --color3: ${allColors[colors[2]]}`
      };
    }
    
    // Default to solid color
    return { classes: getRandomSolidColor() };
  }

  // Weave a new row (smooth cloth-like version)
  function weaveNewRow() {
    if (!weavingActive) return;

    const squares = Array.from(grid.children);
    
    // Move all squares up gradually
    for (let i = 0; i < squares.length; i++) {
      const square = squares[i];
      const currentRow = Math.floor(i / cols);
      
      // Skip animation for the row being removed
      if (currentRow === 0) {
        square.style.transition = 'none';
        square.style.opacity = '0';
        square.style.transform = 'translateY(-10px)';
      } else {
        square.style.transition = 'transform 0.5s ease-out, opacity 0.3s ease-out';
        square.style.transform = `translateY(calc(-100% - 2px))`; // 2px is the gap
      }
    }
    
    // After move animation completes, remove top row and add new bottom row
    setTimeout(() => {
      // Remove top row
      for (let i = 0; i < cols; i++) {
        grid.removeChild(grid.children[0]);
      }
      
      // Move remaining squares up in DOM (no visual change)
      for (let i = 0; i < (rows-1)*cols; i++) {
        const square = grid.children[i];
        const newRow = Math.floor(i / cols);
        square.style.gridRowStart = newRow + 1;
        square.style.transform = 'translateY(0)';
      }
      
      // Add new bottom row
      for (let col = 0; col < cols; col++) {
        const square = document.createElement('div');
        const color = getRandomColor();
        
        square.className = 'weaver-square ' + color.classes;
        if (color.styles) {
          square.style.cssText = color.styles;
        }
        square.style.gridRowStart = rows;
        square.style.gridColumnStart = col + 1;
        square.style.opacity = '0';
        square.style.transform = 'translateY(100%)';
        
        grid.appendChild(square);
        
        // Animate in with staggered delay
        setTimeout(() => {
          square.style.animation = 'weaveIn 0.7s ease-out forwards';
        }, 50 * col);
      }
    }, 500); // Match this with the CSS transition duration
  }

  // Start weaving
  function startWeaving() {
    if (weavingActive) return;
    weavingActive = true;
    weaveInterval = setInterval(weaveNewRow, 1500);
    startBtn.disabled = true;
    stopBtn.disabled = false;
  }

  // Stop weaving
  function stopWeaving() {
    weavingActive = false;
    clearInterval(weaveInterval);
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  // Initialize Intersection Observer for auto-pause
function initObserver() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!weavingActive) startWeaving();
      } else {
        if (weavingActive) stopWeaving();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(grid);
}

  // Initialize everything
function init() {
  initializeGrid();
  initObserver();
  // Remove the setTimeout that automatically starts weaving
}

  init();
});