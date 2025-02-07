class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  after_action :set_csrf_cookie

  # Set CSRF token as a cookie, so the JS app can get it
  private def set_csrf_cookie
    cookies['CSRF-Token'] = form_authenticity_token if form_authenticity_token.present?
  end
end
