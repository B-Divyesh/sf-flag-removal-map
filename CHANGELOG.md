# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project uses semantic versioning.

## [Unreleased]

### Fixed

- Reject malformed observation timestamps before they can qualify a flag as a removal candidate.
- Compare browser and CLI classifications and evidence reasons across complete date fixtures.

## [0.1.0] - 2026-08-27

### Added

- Offline feature-flag export parsing and repository reference scanning.
- Conservative keep, remove-candidate, and review classifications.
- Markdown plans, JSON output, CI review gate, and static documentation site.
