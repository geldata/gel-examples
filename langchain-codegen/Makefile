REPO_URL       := https://github.com/geldata/gel.git
BRANCH_NAME    := master
DIRECTORY_PATH := docs
TEMP_DIR       := _temp_sparse_checkout

docs:
	@echo "--- Starting: Fetch only '$(DIRECTORY_PATH)' directory using sparse checkout ---"

	@echo "1. Creating and initializing temporary directory..."
	rm -rf $(TEMP_DIR)
	mkdir -p $(TEMP_DIR)
	cd $(TEMP_DIR) && git init

	@echo "2. Adding remote repository..."
	cd $(TEMP_DIR) && git remote add origin $(REPO_URL)

	@echo "3. Configuring sparse-checkout for '$(DIRECTORY_PATH)' only..."
	cd $(TEMP_DIR) && git config core.sparseCheckout true
	cd $(TEMP_DIR) && echo "$(DIRECTORY_PATH)/*" > .git/info/sparse-checkout

	@echo "4. Fetching only '$(DIRECTORY_PATH)' from '$(REPO_URL)' (branch: $(BRANCH_NAME))..."
	cd $(TEMP_DIR) && git fetch --depth=1 origin $(BRANCH_NAME)
	cd $(TEMP_DIR) && git checkout $(BRANCH_NAME)

	@echo "5. Copying '$(DIRECTORY_PATH)' to main directory while preserving directory structure..."
	rm -rf $(DIRECTORY_PATH)
	cp -R $(TEMP_DIR)/$(DIRECTORY_PATH) . 2>/dev/null || true

	@echo "6. Cleaning up temporary directory..."
	rm -rf $(TEMP_DIR)

.PHONY: docs
