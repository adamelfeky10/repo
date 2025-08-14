document.addEventListener('DOMContentLoaded', function() {
  
  // ======================
  //  SIDEBAR TOGGLE LOGIC
  // ======================
  const shopBtn = document.getElementById('shopCategoriesBtn');
  const sidebar = document.getElementById('categoriesSidebar');
  const overlay = document.getElementById('overlay');

  if (shopBtn && sidebar && overlay) {
    shopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sidebar.classList.toggle('active');
      overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !shopBtn.contains(e.target) && e.target !== overlay) {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
      }
    });
  }

  // ======================
  //  SEARCH SUGGESTIONS
  // ======================
  const searchInput = document.getElementById('search-input');
  const suggestions = document.querySelector('.search-suggestions');
  
  if (searchInput && suggestions) {
    searchInput.addEventListener('focus', () => {
      suggestions.style.display = 'block';
    });
    
    document.addEventListener('click', (e) => {
      const searchWrapper = document.getElementById('search-wrapper');
      if (searchWrapper && !searchWrapper.contains(e.target)) {
        suggestions.style.display = 'none';
      }
    });
  }

  // ======================
  //  CAROUSEL INITIALIZATION
  // ======================
  if (typeof $ !== 'undefined') {
    $(function() {
      // Main Slick Carousel (Hero Slider)
      $('.main-carousel').slick({
        dots: true,
        infinite: true,
        speed: 1000,
        fade: true,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        pauseOnHover: true,
        adaptiveHeight: true
      });

      // Category Carousel (Owl Carousel)
      $('.owl-carousel').owlCarousel({
        items: 4,
        loop: true,
        margin: 15,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 2 },
          576: { items: 3 },
          768: { items: 4 },
          992: { items: 7 }
        }
      });

      // Flash Deals Carousel (Owl Carousel)
      $('.flash-carousel').owlCarousel({
        items: 5,
        margin: 20,
        nav: true,
        dots: false,
        loop: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1 },
          576: { items: 2 },
          768: { items: 3 },
          992: { items: 5 }
        }
      });

      // Additional Slick Carousels
      $('.fade').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 3000
      });
    });
  } else {
    console.error('jQuery is not loaded - Carousels cannot initialize');
  }

    $(document).ready(function(){
    // Initialize related products carousel
    $('.related-products-carousel').owlCarousel({
      loop: true,
      margin: 20,
      nav: true,
      dots: false,
      responsive: {
        0: { items: 1 },
        576: { items: 2 },
        768: { items: 3 },
        992: { items: 4 }
      }
    });
    
    // Product gallery thumbnail click
    $('.product-gallery-thumbnail').click(function(){
      $('.product-gallery-thumbnail').removeClass('active');
      $(this).addClass('active');
      const mainImageSrc = $(this).attr('src').replace('-100x100', '');
      $('.product-main-image').attr('src', mainImageSrc);
    });
    
    // Color option selection
    $('.product-color-option').click(function(){
      $('.product-color-option').removeClass('active');
      $(this).addClass('active');
    });
    
    // Size option selection
    $('.product-size-option').click(function(){
      $('.product-size-option').removeClass('active');
      $(this).addClass('active');
    });
    
    // Quantity controls
    $('.quantity-input').on('change', function(){
      let value = parseInt($(this).val());
      if(isNaN(value) || value < 1) {
        $(this).val(1);
      }
    });
    
    $('.quantity-input').closest('.input-group').find('button').on('click', function(){
      const input = $(this).closest('.input-group').find('.quantity-input');
      let value = parseInt(input.val());
      
      if($(this).text() === '+') {
        input.val(value + 1);
      } else {
        if(value > 1) {
          input.val(value - 1);
        }
      }
    });
  });

$('.related-products-carousel').owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
    dots: false, 
    autoplay: true,
    autoplayTimeout: 3000, 
    autoplayHoverPause: true, 
    responsive: {
        0: { items: 2 },
        768: { items: 3 },
        992: { items: 5 }
    }
});

document.addEventListener('DOMContentLoaded', function() {
  const categoryBadges = document.querySelectorAll('.category-badge');
  const priceRange = document.getElementById('priceRange');
  const priceRangeValue = document.getElementById('priceRangeValue');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const productItems = document.querySelectorAll('.product-item');
  const noResults = document.getElementById('noResults');

  let currentCategory = 'all';
  let currentMaxPrice = 1000;
  let currentSearchTerm = '';

  // Category filter
  categoryBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      categoryBadges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
      currentCategory = badge.dataset.category;
      filterProducts();
    });
  });

  // Price filter
  priceRange.addEventListener('input', () => {
    currentMaxPrice = parseInt(priceRange.value);
    priceRangeValue.textContent = `Price: $0 - $${currentMaxPrice}`;
    filterProducts();
  });

  // Search functionality
  searchButton.addEventListener('click', () => {
    currentSearchTerm = searchInput.value.trim().toLowerCase();
    filterProducts();
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentSearchTerm = searchInput.value.trim().toLowerCase();
      filterProducts();
    }
  });

  function filterProducts() {
    let hasVisibleProducts = false;

    productItems.forEach(item => {
      const category = item.dataset.category;
      const price = parseFloat(item.querySelector('.text-dark.fw-bold').textContent.replace('$', ''));
      const name = item.querySelector('.card-title').textContent.toLowerCase();

      const categoryMatch = currentCategory === 'all' || category === currentCategory;
      const priceMatch = price <= currentMaxPrice;
      const searchMatch = name.includes(currentSearchTerm);

      if (categoryMatch && priceMatch && searchMatch) {
        item.style.display = 'block';
        hasVisibleProducts = true;
      } else {
        item.style.display = 'none';
      }
    });

    noResults.style.display = hasVisibleProducts ? 'none' : 'block';
  }
});


});