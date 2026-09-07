#!/usr/bin/env node
import { createValidator, runCli } from './review-format.mjs';

export const validateReview = createValidator('implementation');
runCli(import.meta.url, validateReview);
