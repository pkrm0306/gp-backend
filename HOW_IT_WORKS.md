# How This NestJS Application Works - A Simple Guide

## 🎯 What is NestJS?

Think of NestJS like a **LEGO building set** for making websites (APIs). Just like LEGO has different types of blocks (bricks, wheels, windows), NestJS has different pieces called **modules**, **controllers**, and **services** that you can put together to build your application.

## 🏗️ The Big Picture

Imagine you're building a **restaurant**:

- **Modules** = Different sections of the restaurant (Kitchen, Dining Room, Storage)
- **Controllers** = The waiters who take orders from customers
- **Services** = The chefs who actually cook the food
- **DTOs** = The menu that shows what customers can order
- **Schemas** = The recipe cards that describe how to store ingredients

## 📁 Project Structure Explained

```
src/
├── main.ts                    ← The front door of your restaurant
├── app.module.ts              ← The manager who organizes everything
│
├── auth/                      ← The security section
│   ├── auth.controller.ts     ← Takes login/register requests
│   ├── auth.service.ts        ← Does the actual login/register work
│   ├── auth.module.ts         ← Groups auth stuff together
│   ├── dto/                   ← Forms for login/register
│   └── strategies/            ← How to check if you're allowed in
│
├── vendors/                   ← The vendor section
│   ├── vendors.controller.ts ← Takes profile requests
│   ├── vendors.service.ts     ← Gets/updates profile data
│   ├── vendors.module.ts      ← Groups vendor stuff together
│   ├── schemas/               ← How vendor data looks in database
│   └── dto/                   ← Forms for updating profile
│
├── common/                    ← Tools everyone can use
│   ├── filters/              ← Catches errors
│   ├── interceptors/          ← Formats responses nicely
│   ├── guards/                ← Security guards
│   ├── decorators/            ← Special labels
│   ├── services/              ← Shared tools (email, captcha)
│   └── utils/                 ← Helper functions
│
└── manufacturers/            ← Another section
    └── vendor-users/          ← Another section
```

## 🔄 How a Request Flows Through the Application

Let's say someone wants to **register** (create an account):

### Step 1: Request Arrives
```
User sends: POST /auth/register-vendor
```

### Step 2: Main.ts (The Front Door)
```typescript
// main.ts - This is where the app starts
// It sets up:
// - CORS (which browser origins may call the API — login, etc.)
// - Validation (checks if data is correct)
// - Error handling (catches mistakes)
// - Swagger (API documentation)
```

### Step 3: App Module (The Manager)
```typescript
// app.module.ts - Organizes all modules
// It says: "Hey, we have AuthModule, VendorsModule, etc."
```

### Step 4: Auth Controller (The Waiter)
```typescript
// auth.controller.ts - Receives the request
@Post('register-vendor')
async registerVendor(@Body() registerDto: RegisterVendorDto) {
  return this.authService.registerVendor(registerDto);
}
```
**What happens:** The controller says "I got a registration request! Let me pass it to the service."

### Step 5: DTO Validation (The Menu Checker)
```typescript
// register-vendor.dto.ts - Checks if the request has all required fields
class RegisterVendorDto {
  @IsString()
  companyName: string;  // Must be a string
  
  @IsEmail()
  email: string;  // Must be a valid email
  
  // ... etc
}
```
**What happens:** "Does this request have everything we need? Company name? Email? Password? Yes? Good!"

### Step 6: Auth Service (The Chef)
```typescript
// auth.service.ts - Does the actual work
async registerVendor(registerDto: RegisterVendorDto) {
  // 1. Check if passwords match
  // 2. Check if email already exists
  // 3. Verify reCAPTCHA
  // 4. Create manufacturer
  // 5. Create vendor
  // 6. Create vendor user
  // 7. Send email
  // 8. Return success
}
```
**What happens:** The service does all the hard work - checking things, saving to database, sending emails.

### Step 7: Response Interceptor (The Wrapper)
```typescript
// response.interceptor.ts - Wraps the response in a nice format
{
  success: true,
  message: "Registration successful",
  data: { ... }
}
```

### Step 8: Response Goes Back
```
User receives: { success: true, message: "...", data: {...} }
```

## 🧩 Building Blocks Explained

### 1. Module (The Container)
A module is like a **box** that holds related things together.

```typescript
@Module({
  imports: [OtherModules],      // What other boxes do I need?
  controllers: [MyController],  // What waiters do I have?
  providers: [MyService],       // What chefs do I have?
  exports: [MyService],         // What can others use from me?
})
export class MyModule {}
```

**Example:** `AuthModule` contains everything related to authentication.

### 2. Controller (The Waiter)
A controller **receives requests** and **sends responses**. It doesn't do the work, it just passes it along.

```typescript
@Controller('auth')  // All routes start with /auth
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('login')  // This becomes POST /auth/login
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

**What it does:**
- `@Controller('auth')` = "I handle requests to /auth"
- `@Post('login')` = "I handle POST requests to /auth/login"
- `@Body()` = "Get the data from the request body"
- Calls the service to do the actual work

### 3. Service (The Chef)
A service does the **actual work** - database operations, calculations, etc.

```typescript
@Injectable()  // "I can be injected into other classes"
export class AuthService {
  constructor(
    private vendorUsersService: VendorUsersService,
    private jwtService: JwtService,
  ) {}
  
  async login(loginDto: LoginDto) {
    // 1. Find user by email
    const user = await this.vendorUsersService.findByEmail(loginDto.email);
    
    // 2. Check password
    const isValid = await this.comparePassword(loginDto.password, user.password);
    
    // 3. Create JWT token
    const token = this.jwtService.sign({ userId: user.id });
    
    // 4. Return token
    return { accessToken: token };
  }
}
```

### 4. DTO (Data Transfer Object) - The Form
A DTO is like a **form** that defines what data you expect.

```typescript
export class RegisterVendorDto {
  @ApiProperty()  // For Swagger documentation
  @IsString()     // Must be a string
  @IsNotEmpty()   // Cannot be empty
  companyName: string;
  
  @ApiProperty()
  @IsEmail()      // Must be a valid email
  email: string;
  
  @ApiProperty()
  @MinLength(6)   // Must be at least 6 characters
  password: string;
}
```

**What it does:** Validates that incoming data has the right format.

### 5. Schema (The Database Blueprint)
A schema defines how data is **stored in the database**.

```typescript
@Schema({ timestamps: true })  // Automatically add createdAt, updatedAt
export class Vendor {
  @Prop({ required: true })
  vendorName: string;
  
  @Prop({ required: true, unique: true })
  vendorEmail: string;
  
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer' })
  manufacturerId: Types.ObjectId;  // Reference to another collection
}
```

**What it does:** Tells MongoDB "Store vendor data like this!"

### 6. Guards (The Security Guards)
Guards check if you're **allowed** to access something.

```typescript
@UseGuards(JwtAuthGuard)  // "Check if user has valid JWT token"
@Get('profile')
async getProfile() {
  // Only runs if guard allows
}
```

**Example:** `JwtAuthGuard` checks if you have a valid token before letting you see your profile.

### 7. Interceptors (The Formatter)
Interceptors **transform** requests or responses.

```typescript
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Success',
        data: data
      }))
    );
  }
}
```

**What it does:** Wraps every response in a standard format.

### 8. Filters (The Error Catcher)
Filters catch **errors** and format them nicely.

```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Format error response
    return {
      success: false,
      message: exception.message,
      error: 'Error occurred'
    };
  }
}
```

## 🛠️ Step-by-Step: How We Built This Application

### Step 1: Set Up the Foundation
1. Created `package.json` with all dependencies
2. Created `tsconfig.json` for TypeScript settings
3. Created `nest-cli.json` for NestJS configuration

### Step 2: Created Main Entry Point (`main.ts`)
```typescript
// This is the first file that runs
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // real app uses NestExpressApplication for /uploads

  // CORS — browser apps on these origins can call /auth/login, /vendor/..., etc.
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3002',
      'https://greenpro-vendor.vercel.app',
      'https://*.vercel.app', // see CORS section below for wildcard notes
    ],
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Swagger at /api ...

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
```

**What it does:** Sets up the entire application when it starts, including **CORS** so your React/Next (or other) frontends can send `fetch`/axios requests with JSON and the `Authorization` header.

### Step 3: Created App Module (`app.module.ts`)
```typescript
@Module({
  imports: [
    ConfigModule.forRoot(),           // Load environment variables
    MongooseModule.forRootAsync(...),  // Connect to MongoDB
    AuthModule,                       // Import auth module
    VendorsModule,                    // Import vendors module
    // ... etc
  ],
})
export class AppModule {}
```

**What it does:** Imports and organizes all modules.

### Step 4: Created Common Utilities
- **Filters:** `http-exception.filter.ts` - Catches errors
- **Interceptors:** `response.interceptor.ts` - Formats responses
- **Guards:** `jwt-auth.guard.ts` - Protects routes
- **Services:** `captcha.service.ts`, `email.service.ts` - Shared tools

### Step 5: Created Database Schemas
1. **Manufacturer Schema** - How manufacturer data is stored
2. **Vendor Schema** - How vendor data is stored (references manufacturer)
3. **VendorUser Schema** - How user data is stored (references vendor)

**Key Point:** We used `Types.ObjectId` and `ref` to create relationships, just like foreign keys in SQL.

### Step 6: Created Modules
For each feature (auth, vendors, etc.), we created:
1. **Module file** - Groups everything together
2. **Service file** - Does the database work
3. **Controller file** - Handles HTTP requests
4. **DTO files** - Validates incoming data
5. **Schema files** - Defines database structure

### Step 7: Implemented Authentication
1. Created JWT strategy for token validation
2. Created **login** endpoint (`POST /auth/login`) that:
   - Checks email/password
   - Requires email verification (for vendor users) and active status
   - Returns **access** and **refresh** JWT tokens plus user info
3. Created **forgot password** endpoint (`POST /auth/forgot-password`) that:
   - Accepts an email, generates a new random password if the user exists
   - Sends the new password by email (Mailtrap / SMTP from `.env`)
4. Created **change password** (`PATCH /vendor/change-password`) for logged-in users:
   - Requires `Authorization: Bearer <accessToken>`
   - Checks current password, then saves new password (min 6 characters)
5. Created registration endpoint that:
   - Validates data
   - Checks reCAPTCHA
   - Creates records in transaction
   - Sends email

### Step 8: Added Security
- Password hashing with bcrypt
- JWT tokens for authentication
- Guards to protect routes
- Role-based access control

## 🔐 Login, Forgot Password & Change Password (APIs & JSON)

Use your server base URL (for example `http://localhost:3000` if `PORT` is not set). There is **no** path prefix: routes are exactly `/auth/...` and `/vendor/...`.

### CORS (browser → API)

CORS stays **enabled** in `src/main.ts` via `app.enableCors(...)`. That matters when your **frontend runs on a different origin** than the API (e.g. app on `http://localhost:3001`, API on `http://localhost:3000`).

**Allowed origins** (as in code today):

| Origin | Purpose |
| ------ | ------- |
| `http://localhost:3001` | Local frontend |
| `http://localhost:3002` | Local frontend (alternate port) |
| `https://greenpro-vendor.vercel.app` | Production vendor app |
| `https://*.vercel.app` | Listed for Vercel previews (if a browser blocks this, add your exact preview URL to the array or use a dynamic `origin` function in `main.ts`) |

**Allowed methods:** `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`

**Allowed headers:** `Content-Type`, `Authorization` — so **login** (JSON body) and **change password** (`Authorization: Bearer ...`) work from the browser.

**Credentials:** `credentials: false`. If you later use cookies across origins, set `credentials: true` and list explicit origins (no `*`).

**Adding another dev URL:** Edit the `origin` array in `main.ts` (e.g. add `http://localhost:5173` for Vite) and restart the server.

Example **fetch** from a page on `http://localhost:3001`:

```javascript
const res = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'prabhasmiraki@gmail.com',
    password: 'Dedeepya@123',
  }),
});
const json = await res.json();
```

---

All successful responses are wrapped by the **ResponseInterceptor** like this:

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

If the handler returns only a `message` and no `data` field, `data` may contain the full returned object (see forgot-password below).

---

### 1. Login — `POST /auth/login`

**No auth header.** Send JSON with `email` and `password` (both required strings; email must be valid).

**Example request body** (same shape your app or Postman should use):

```json
{
  "email": "prabhasmiraki@gmail.com",
  "password": "Dedeepya@123"
}
```

**cURL example:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"prabhasmiraki@gmail.com\",\"password\":\"Dedeepya@123\"}"
```

**What the server checks (in order):**

1. User exists for that email → if not: `401` *Invalid credentials*
2. Password matches stored hash → if not: `401` *Invalid credentials*
3. For users who are **not** type `partner`, email must be verified (`isVerified`) → else: `401` *Email not verified*
4. User `status` must be `1` (active) → else: `401` *Account is inactive*

**Typical success response** (tokens and `user` are real values from your server):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "prabhasmiraki@gmail.com",
      "name": "Your Company Name",
      "type": "vendor"
    }
  }
}
```

Copy **`data.accessToken`** and send it on protected routes:

```http
Authorization: Bearer <accessToken>
```

Token lifetime comes from `.env`: `JWT_EXPIRES_IN` (default `15m`) and `JWT_REFRESH_EXPIRES_IN` (default `7d` for the refresh token). There is **no** separate refresh endpoint in this project yet—you can still use the refresh token in your own client logic or add an endpoint later.

---

### 2. Forgot password — `POST /auth/forgot-password`

**No auth header.** Only the registered **email** is required.

**Example request body:**

```json
{
  "email": "prabhasmiraki@gmail.com"
}
```

**cURL example:**

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"prabhasmiraki@gmail.com\"}"
```

**Behavior:**

- If the email **is not** in the database, the API still responds with a **generic** message (so strangers cannot discover which emails are registered).
- If the email **exists**, the password is **replaced** with a new random hex string, and an email is sent with that new password (configure `MAIL_*` in `.env`).

**Example response when email was found** (shape may vary slightly in `data` because of the interceptor):

```json
{
  "success": true,
  "message": "New password has been sent to your email",
  "data": {
    "message": "New password has been sent to your email"
  }
}
```

**Example response when email was not found** (same idea—generic wording):

```json
{
  "success": true,
  "message": "If the email exists, a new password has been sent to your email.",
  "data": {
    "message": "If the email exists, a new password has been sent to your email."
  }
}
```

After you receive the new password in email, call **`POST /auth/login`** again with that password. Then use **change password** if you want to set your own.

---

### 3. Change password — `PATCH /vendor/change-password`

**Requires login:** `Authorization: Bearer <accessToken>` from a successful login.

**Example request body** (`newPassword` must be at least **6** characters; `confirmPassword` must match `newPassword`):

```json
{
  "currentPassword": "Dedeepya@123",
  "newPassword": "MyNewSecurePass1",
  "confirmPassword": "MyNewSecurePass1"
}
```

**cURL example** (replace `YOUR_ACCESS_TOKEN`):

```bash
curl -X PATCH http://localhost:3000/vendor/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"currentPassword\":\"Dedeepya@123\",\"newPassword\":\"MyNewSecurePass1\",\"confirmPassword\":\"MyNewSecurePass1\"}"
```

**Errors you might see:**

- `400` — New and confirm password do not match
- `401` — Missing/invalid token, or **current password is incorrect**
- `400` — User not found (unusual if token is valid)

**Success response:**

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "message": "Password changed successfully"
  }
}
```

---

### Quick copy-paste summary

| Action           | Method | Path                        | Auth        |
| ---------------- | ------ | --------------------------- | ----------- |
| Login            | POST   | `/auth/login`               | None        |
| Forgot password  | POST   | `/auth/forgot-password`     | None        |
| Change password  | PATCH  | `/vendor/change-password`   | Bearer JWT  |

Test the same JSON in **Swagger**: open `http://localhost:3000/api` → **Auth** / **Vendor** tags.

## 🎓 How to Create Your Own Module

Let's say you want to create a **Products** module. Here's how:

### Step 1: Create the Schema
```typescript
// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  productName: string;
  
  @Prop({ required: true })
  price: number;
  
  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  vendorId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

### Step 2: Create the DTO
```typescript
// src/products/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productName: string;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
```

### Step 3: Create the Service
```typescript
// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}
  
  async create(data: Partial<Product>): Promise<ProductDocument> {
    const product = new this.productModel(data);
    return product.save();
  }
  
  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().exec();
  }
  
  async findById(id: string): Promise<ProductDocument | null> {
    return this.productModel.findById(id).exec();
  }
}
```

### Step 4: Create the Controller
```typescript
// src/products/products.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return { message: 'Product created', data: product };
  }
  
  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    return { message: 'Products retrieved', data: products };
  }
}
```

### Step 5: Create the Module
```typescript
// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],  // If other modules need to use it
})
export class ProductsModule {}
```

### Step 6: Import in App Module
```typescript
// src/app.module.ts
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // ... existing imports
    ProductsModule,  // Add this
  ],
})
export class AppModule {}
```

**That's it!** Now you have:
- `POST /products` - Create a product
- `GET /products` - Get all products

## 🔑 Key Concepts to Remember

1. **Module** = Container that groups related things
2. **Controller** = Receives HTTP requests (the waiter)
3. **Service** = Does the actual work (the chef)
4. **DTO** = Validates incoming data (the form)
5. **Schema** = Defines database structure (the blueprint)
6. **Guard** = Security check (the bouncer)
7. **Interceptor** = Transforms requests/responses (the formatter)
8. **Filter** = Catches errors (the error handler)

## 🎯 The Flow Pattern (Remember This!)

```
Request → Controller → DTO Validation → Service → Database → Service → Controller → Interceptor → Response
```

Every request follows this pattern!

## 💡 Pro Tips

1. **Always validate** with DTOs before processing
2. **Use transactions** when creating related records
3. **Hash passwords** before storing
4. **Use guards** to protect routes
5. **Export services** if other modules need them
6. **Use decorators** (`@Get()`, `@Post()`, etc.) to define routes
7. **Inject dependencies** in constructor

## 🚀 Next Steps

Now that you understand the structure:
1. Try creating a new module (like Products above)
2. Add more endpoints (PUT, DELETE)
3. Add relationships between modules
4. Add more validation rules
5. Add pagination to list endpoints

Remember: **Practice makes perfect!** Start small, build one module at a time, and you'll get the hang of it! 🎉
